import docker
from docker.errors import NotFound, APIError

from sqlalchemy.orm import Session
from datetime import datetime, timezone
from models.container import Container # model 생성 후 수정 예정

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
    
    # DB 연동
    def sync_to_db(self, db: Session) -> list[Container]:
        container_list = self.list_containers(all=True)

        # 빠른 container 검색를 위한 map 생성
        container_map = {c["id"]: c for c in container_list}

        db_containers = db.query(Container).all()
        # 빠른 db 검색를 위한 map 생성
        db_map = {c.container_id: c for c in db_containers}

        now = datetime.now(timezone.utc) # DB 컬럼 timezone-aware 가능한지 확인

        # 컨테이너 조회
        for container_id, info in container_map.items():
            # DB에 있을 경우
            if container_id in db_map:
                db_c = db_map[container_id]
                db_c.status     = info["status"]
                db_c.image      = info["image"]
                db_c.updated_at = now
            else:
                db.add(Container(
                    container_id  = container_id,
                    name       = info["name"],
                    image      = info["image"],
                    status     = info["status"],
                    updated_at = now,
                ))

        # 컨테이너가 삭제되었지만 DB에 존재하는 경우
        for container_id, db_c in db_map.items():
            if container_id not in container_map:
                db_c.status     = "stopped"
                db_c.updated_at = now

        db.commit()
        return db.query(Container).all()