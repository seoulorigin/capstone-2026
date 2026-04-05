from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import random

from database import get_db
from schemas.container import ContainerStatResponse
from services.docker_service import DockerService
from docker.errors import NotFound, APIError


router = APIRouter(tags=["monitoring"])

docker_service = DockerService()

# 간단 도커 목록 및 조회 테스트 
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

# 7. Docker 소켓 연결 상태 확인 (Health Check)
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
