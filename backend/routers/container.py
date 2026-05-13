from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
import random
import asyncio

from concurrent.futures import ThreadPoolExecutor

from database import get_db
from schemas.container import ContainerStatResponse
from services.docker_service import DockerService
from docker.errors import NotFound, APIError
from schemas.container import ComposeDeployRequest, ComposeDeployResponse

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
                "id": c["container_id"],
                "name": c["name"],
                "image": c["image"],
                "status": c["status"],
                "updated_at": c["updated_at"],
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
    # WS로 전환시 이 엔드포인트는 사용하지 않음. 나중에 정리차원에서 실제 데이터로 바꾸고 싶다면 이렇게 바꿈.
    #loop = asyncio.get_event_loop()
    #stats = await loop.run_in_executor(
    #    executor,
    #    docker_service.get_container_stats,
    #    container_id
    #)
    #return stats
    
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
            try:
                stats = await asyncio.wait_for(
                    loop.run_in_executor(
                        executor,
                        docker_service.get_container_stats,
                        container_id
                    ),
                    timeout = 10.0
                )

            except asyncio.TimeoutError:
                print(f"Metrics WS Timeout: {container_id}")
                continue
            
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
    print(f"Logs WS Connected: {container_id}")
    
    loop = asyncio.get_event_loop()
    closed = False # 중복 close 방지 플래그
    
    try:
        log_generator = await loop.run_in_executor(
            executor,
            docker_service.get_container_logs_json,
            container_id)

        def read_next():
            try:
                return next(log_generator)
            except StopIteration:
                return None

        while True:
            payload = await loop.run_in_executor(executor, read_next)

            if payload is None:
                break

            await websocket.send_json(payload)
            await asyncio.sleep(0.1)

    except WebSocketDisconnect:
            print(f"logs WS Disconnected: {container_id}")
       
            
    except Exception as e:
        
        print(f"로그 전송 에러: {e}")
        if not closed:
            try:
                await websocket.send_json({
                    "time":datetime.now().strftime("%H:%M:%S"),
                    "stream": "stderr",
                    "message":f"[error] {str(e)}"
                    })
            except Exception:
                pass      
            
    finally:
        # 이미 닫힌 소켓에 중복 close 방지
        if not closed:
            closed = True
            try:
                await websocket.close()
            except Exception:
                pass


@router.post("/compose/up")
async def deploy_compose(request: ComposeDeployRequest):
    try:
        result = await docker_service.deploy_compose(request.yaml)
        return {"status": "success", "message": "Deployment started", "details":result}
    except Exception as e:
        raise HTTPException(status_code = 400, detail=str(e))
