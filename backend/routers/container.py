from fastapi import APIRouter
from datetime import datetime
from backend.schemas.container import ContainerStatResponse

router = APIRouter(prefix="/containers", tags=["monitoring"])

@router.get("/{container_id}/stats", response_model=ContainerStatResponse)
async def get_container_stats(container_id: int):
    # 추후 팀원의 service 함수 get_realtime_stats가 완성되면 교체
    return {
        "container_id": container_id
        "cpu_percent:": 15.4,
        "memory_mb": 256.2
        "memory_limit_mb": 1024.0,
        "timestamp": datetime.utcnow()
        }
