from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime
import random
import asyncio

from database import get_db
from schemas.container import ContainerStatResponse
from services.docker_service import DockerService
from docker.errors import NotFound, APIError

# container router 설정
router = APIRouter()

docker_service = DockerService()

# 간단 도커 목록 및 조회 테스트 (DB 없이)
@router.get("/test")
def get_list():
    try:
        containers = docker_service.list_containers()
        return [
            {
                "id": c["id"],
                "name": c["name"],
                "image": c["image"],
                "status": c["status"],
            }
            for c in containers
        ]
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Docker 오류: {str(e)}")




# 컨테이너 목록 조회 (DB 동기화 포함)
@router.get("/")
def get_containers(db: Session = Depends(get_db)):
    try:
        containers = docker_service.sync_to_db(db)
        return [
            {
                "id": c.container_id,
                "name": c.name,
                "image": c.image,
                "status": c.status,
                "updated_at": c.updated_at,
            }
            for c in containers
        ]
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Docker 오류: {str(e)}")


# 단일 컨테이너 상태 조회
@router.get("/{container_id}")
def get_container(container_id: str, db: Session = Depends(get_db)):
    try:
        container = docker_service.get_container(container_id)
        return container
    except NotFound:
        raise HTTPException(status_code=404, detail="컨테이너를 찾을 수 없습니다.")
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Docker 오류: {str(e)}")


# 컨테이너 실행
@router.post("/{container_id}/start")
def start_container(container_id: str):
    try:
        return docker_service.start_container(container_id)
    except NotFound:
        raise HTTPException(status_code=404, detail="컨테이너를 찾을 수 없습니다.")
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Docker 오류: {str(e)}")


# 컨테이너 종료
@router.post("/{container_id}/stop")
def stop_container(container_id: str):
    try:
        return docker_service.stop_container(container_id)
    except NotFound:
        raise HTTPException(status_code=404, detail="컨테이너를 찾을 수 없습니다.")
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Docker 오류: {str(e)}")


# 컨테이너 재시작
@router.post("/{container_id}/restart")
def restart_container(container_id: str):
    try:
        return docker_service.restart_container(container_id)
    except NotFound:
        raise HTTPException(status_code=404, detail="컨테이너를 찾을 수 없습니다.")
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Docker 오류: {str(e)}")


# Docker 소켓 연결 상태 확인
@router.get("/health/ping")
def ping():
    try:
        ok = docker_service.ping()
        return {"connected": ok}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Docker 연결 실패: {str(e)}")


# 리소스 실시간 통계 조회
# 프론트엔드 Polling 대응을 위해 호출 시마다 랜덤한 리소스 값을 반환
@router.get("/{container_id}/stats", response_model=ContainerStatResponse)
async def get_container_stats(container_id: str):

# 특정 컨테이너의 CPU, 메모리 사용량을 반환
# 현재는 시뮬레이션을 위해 랜덤 데이터를 생성

    return {
        "container_id": container_id,
        "cpu_percent": round(random.uniform(5.0, 25.0), 1),
        "memory_mb": round(random.uniform(200.0, 400.0), 1),
        "memory_limit_mb": 1024.0,
        "timestamp": datetime.utcnow()
    }

# 리소스 실시간 통계 조회 (Polling 대응용 - 기존 유지)
@router.get("/{container_id}/stats", response_model=ContainerStatResponse)
async def get_container_stats_http(container_id: str):
    return docker_service.get_container_stats(container_id)

# [Metrics WS] 엔드포인트
@router.websocket("/ws/metrics/{container_id}")
async def websocket_metrics(websocket: WebSocket, container_id: str):
    await websocket.accept()
    print(f"Metrics WS Connected: {container_id}")
    
    try:
        while True:
            # 팀원 협의안: 현재 docker_service.get_container_stats() 반환 구조 유지
            stats = docker_service.get_container_stats(container_id)
            
            # 굳이 timestamp를 넣지 않아도 된다고 했지만, 
            # 혹시 필요할 경우를 대비해 여기서 추가하거나 제외할 수 있습니다.
            await websocket.send_json(stats)
            
            # 팀원 협의안: 전송 주기 3초
            await asyncio.sleep(3)
            
    except WebSocketDisconnect:
        print(f"Metrics WS Disconnected: {container_id}")
    except Exception as e:
        print(f"Metrics WS Error: {e}")
        await websocket.close()

# [Logs WS] 엔드포인트
@router.websocket("/ws/logs/{container_id}")
async def websocket_logs(websocket: WebSocket, container_id: str):
    await websocket.accept()
    print(f"Logs WS Connected: {container_id}")
    
    try:
        # Docker SDK를 통해 로그 스트림 가져오기
        # tail=10으로 시작 시 최근 로그 10줄을 먼저 보여줍니다.
        log_generator = docker_service.get_container_logs(container_id)
        
        # log_generator는 bytes를 하나씩 내뱉는 이터레이터입니다.
        for line in log_generator:
            # bytes를 문자열로 디코딩
            log_message = line.decode('utf-8').strip()
            
            payload = {
                "time": datetime.now().strftime("%H:%M:%S"),
                "stream": "stdout",  # 실제 운영 시 stderr 구분 로직을 추가할 수 있습니다.
                "message": log_message
            }
            
            await websocket.send_json(payload)
            # 로그는 sleep 없이 발생하는 즉시 전송합니다.
            
    except WebSocketDisconnect:
        print(f"Logs WS Disconnected: {container_id}")
    except Exception as e:
        print(f"Logs WS Error: {e}")
        await websocket.close()

