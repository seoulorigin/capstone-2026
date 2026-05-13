import asyncio
import docker
import subprocess
import tempfile
import os
import yaml 
from docker.errors import NotFound, APIError
from fastapi import HTTPException

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

    def get_container_stats(self, container_id: str) -> dict:
        try: 
            container = self.client.containers.get(container_id)
            if container.status != "running":
                return {
                    "id": container_id[:12],
                    "name": container.name,
                    "status": container.status,
                    "cpu_percent": 0.0,
                    "memory_usage_mb": 0.0,
                    "memory_limit_mb": 0.0,
                    "memory_percent": 0.0,
                }

            stats = next(container.stats(stream=True))
        
            
            # CPU 사용률 계산
            cpu_delta = stats["cpu_stats"]["cpu_usage"]["total_usage"] - stats["precpu_stats"]["cpu_usage"]["total_usage"]
            system_delta = stats["cpu_stats"]["system_cpu_usage"] - stats["precpu_stats"]["system_cpu_usage"]
            num_cpus = stats["cpu_stats"].get("online_cpus") or len(stats["cpu_stats"]["cpu_usage"].get("percpu_usage", [1]))
            cpu_percent = (cpu_delta / system_delta) * num_cpus * 100.0 if system_delta > 0 else 0.0

            # 메모리 사용량 계산 (MB 단위)
            mem_stats = stats["memory_stats"]
            memory_usage = mem_stats.get("usage", 0) - mem_stats.get("stats", {}).get("cache", 0)
            memory_limit = mem_stats.get("limit", 0)
            memory_percent = (memory_usage / memory_limit * 100.0) if memory_limit > 0 else 0.0

            return {
                "id": container_id[:12],
                "name": container.name,
                "status": container.status,
                "cpu_percent": round(cpu_percent, 2),
                "memory_usage_mb": round(memory_usage / (1024 ** 2), 2),
                "memory_limit_mb": round(memory_limit / (1024 ** 2), 2),
                "memory_percent": round(memory_percent, 2),
            }
        except Exception:
            return {"id":container_id[:12], "status":"error"}

    def get_container_logs(self, container_id: str):
        container = self.client.containers.get(container_id)
        # stream=True, follow=True를 통해 실시간 로그 스트림 반환  
        return container.logs(stream=True, follow=True, tail=10)

    def get_container_logs_json(self, container_id: str):
    from datetime import timezone, timedelta
    KST = timezone(timedelta(hours=9))
    container = self.client.containers.get(container_id)
    log_stream = container.logs(stream=True, follow=True, tail=10)

    def generate():
        for line in log_stream:
            yield {
                "time": datetime.now(KST).strftime("%H:%M:%S"),
                "stream": "stdout",
                "message": line.decode("utf-8", errors="replace").strip()
            }
    return generate()

    async def deploy_compose(self, yaml_text: str) -> dict:
        # YAML 유효성 검사
        try:
            yaml.safe_load(yaml_text)
        except yaml.YAMLError as e:
            raise HTTPException(
                status_code=400,
                detail={"status": "error", "message": f"유효하지 않은 YAML입니다: {e}"},
            )
 
        # 임시 파일 생성 (delete=False → finally에서 직접 삭제)
        with tempfile.NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
            f.write(yaml_text)
            tmp_path = f.name
 
        loop = asyncio.get_event_loop()
 
        def run_compose():
            try:
                result = subprocess.run(
                    ["docker", "compose", "-f", tmp_path, "up", "-d"],
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0:
                    # 실패 시 stderr 메시지를 RuntimeError로 전달
                    raise RuntimeError(result.stderr.strip())
                return result.stdout
            finally:
                # 성공/실패 무관하게 임시 파일 항상 삭제
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
 
        try:
            # blocking subprocess를 thread executor로 분리 → 이벤트 루프 블로킹 방지
            output = await loop.run_in_executor(None, run_compose)
            return {"status": "success", "message": "Compose 배포가 완료되었습니다.", "output": output}
        except RuntimeError as e:
            # 프론트와 협의한 에러 응답 구조: detail: { status, message }
            raise HTTPException(
                status_code=500,
                detail={"status": "error", "message": str(e)},
            )
 

    def sync_to_db(self, db=None):
        containers = self.list_containers(all=True)
        formatted = []
        for c in containers:
            formatted.append({
                "container_id": c["id"],
                "name": c["name"],
                "image": c["image"],
                "status": c["status"],
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
        return formatted 

docker_service = DockerService() 
