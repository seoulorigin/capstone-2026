from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime
import random
import asyncio

from concurrent.futures import ThreadPoolExecutor

from database import get_db
from schemas.container import ContainerStatResponse
from services.docker_service import DockerService
from docker.errors import NotFound, APIError
from schemas.container import ComposeRequest

executor = ThreadPoolExecutor(max_workers=10)

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

    return {
        "container_id": container_id,
        "cpu_percent": round(random.uniform(5.0, 25.0),1),
        "memory_mb": round(random.uniform(200.0, 400.0), 1),
        "memory_limit_mb": 1024.0,
        "timestamp": datetime.utcnow()
    }


# [Metrics WS] 엔드포인트
@router.websocket("/ws/metrics/{container_id}")
async def websocket_metrics(websocket: WebSocket, container_id: str):
    await websocket.accept()
    print(f"Metrics WS Connected: {container_id}")

    loop = asyncio.get_event_loop()
    try:
        while True:
            stats = await loop.run_in_executor(
                executor, 
                docker_service.get_container_stats, 
                container_id
            )
            
            if stats:
                await websocket.send_json(stats)
            
            await asyncio.sleep(3) # 3초 주기 유지
            
    except WebSocketDisconnect:
        print(f"Metrics WS Disconnected: {container_id}")
    except Exception as e:
        print(f"Metrics WS Error: {e}")
    finally:
        # 안전하게 소켓 닫기
        try:
            await websocket.close()
        except:
            pass

# [Logs WS] 엔드포인트
@router.websocket("/ws/logs/{container_id}")
async def websocket_logs(websocket: WebSocket, container_id: str):
    await websocket.accept()
    
    # print(f"Logs WS Connected: {container_id}")
    loop = asyncio.get_event_loop()
    
    try:
        log_generator = await loop.run_in_executor(
            executor,
            docker_service.get_container_logs,
            container_id)
        
        # log_generator는 bytes를 하나씩 내뱉는 이터레이터입니다.
        for line in log_generator:
            log_message = line.decode('utf-8').strip()
            
            payload = {
                "time": datetime.now().strftime("%H:%M:%S"),
                "stream": "stdout",  
                "message": log_message
            }
            
            await websocket.send_json(payload)
            await asyncio.sleep(0.1)   
            
    except Exception as e:
        print(f"로그 전송 에러: {e}")
    finally:
        await websocket.close()

@router.post("/compose/up")
async def deploy_compose(request: ComposeRequest):
    try:
        result = await docker_service.deploy_with_yaml(request.yaml)
        return {"status": "success", "message": "Deployment started", "details":result}
    except Exception as e:
        raise HTTPException(status_code = 400, detail=str(e))
