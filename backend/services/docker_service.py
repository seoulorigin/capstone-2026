import docker
from docker.errors import NotFound, APIError

from sqlalchemy.orm import Session
from datetime import datetime, timezone

# model 생성 후 수정 예정
# from models.container import Container

class DockerService:
    def __init__(self):
        self.client = docker.from_env()

    # Docker 소켓 연결 확인
    def ping(self) -> bool:
        return self.client.ping()
    
    # 컨테이너 목록 조회
    def list_containers(self, all: bool = True) -> list:
        containers = self.client.containers.list(all=all)
        return [self._format_container(c) for c in containers]
    
    # 단일 컨테이너 조회
    def get_container(self, container_id: str) -> dict:
        container = self.client.containers.get(container_id)
        return self._format_container(container)
    
    # 컨테이너 실행
    def start_container(self, container_id: str) -> dict:
        container = self.client.containers.get(container_id)
        container.start()
        container.reload()
        return self._format_container(container)
    
    # 컨테이너 종료
    def stop_container(self, container_id: str) -> dict:
        container = self.client.containers.get(container_id)
        container.stop()
        container.reload()
        return self._format_container(container)
    
    # 컨테이너 재시작
    def restart_container(self, container_id: str) -> dict:
        container = self.client.containers.get(container_id)
        container.restart()
        container.reload()
        return self._format_container(container)
    
    # 컨테이너 정보 포멧
    def _format_container(self, container) -> dict:
        return {
            "id": container.id[:12], # 12자리만 출력
            "name": container.name,
            "image": container.attrs["Config"]["Image"], # 태그 "nginx:1.25"
            "status": container.status
        }