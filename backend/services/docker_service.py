import asyncio
import docker
from docker.errors import NotFound, APIError
import subprocess
import tempfile
import os
from pathlib import Path
import yaml
from datetime import datetime, timezone
from typing import Generator

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

        stats = container.stats(stream=False)

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

    def get_container_logs(self, container_id: str):
        container = self.client.containers.get(container_id)
        return container.logs(stream=True)

    def sync_to_db(self, db) -> list:
        from models.container import Container
        containers = self.client.containers.list(all=True)
        result = []
        for c in containers:
            existing = db.query(Container).filter(Container.container_id == c.id[:12]).first()
            if existing:
                existing.status = c.status
                existing.name = c.name
                existing.image = c.attrs["Config"]["Image"]
            else:
                existing = Container(
                    container_id=c.id[:12],
                    name=c.name,
                    image=c.attrs["Config"]["Image"],
                    status=c.status,
                )
                db.add(existing)
            db.commit()
            db.refresh(existing)
            result.append(existing)
        return result


class ComposeManager:
    def __init__(self, project_name: str):
        self.project_name = project_name
        self.compose_dir = Path(tempfile.gettempdir()) / "compose_projects" / project_name
        self.compose_file = self.compose_dir / "docker-compose.yaml"
        self.compose_dir.mkdir(parents=True, exist_ok=True)

    def validate_yaml(self, yaml_content: str) -> bool:
        try:
            data = yaml.safe_load(yaml_content)
            return data is not None and "services" in data
        except yaml.YAMLError:
            return False

    def save_yaml(self, yaml_content: str) -> str:
        try:
            self.compose_file.write_text(yaml_content, encoding='utf-8')
            return str(self.compose_file)
        except Exception as e:
            raise Exception(f"YAML 파일 저장 실패: {str(e)}")

    async def up_async(self):
        self._process = await asyncio.create_subprocess_exec(
            "docker", "compose", "-f", str(self.compose_file), "up",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
            cwd=str(self.compose_dir)
        )
        try:
            async for line in self._process.stdout:
                line = line.decode().rstrip()
                if line:
                    yield {
                        "type": "log",
                        "message": line,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }

            await self._process.wait()
            if self._process.returncode == 0:
                yield {
                    "type": "completed",
                    "message": "배포 완료",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            else:
                yield {
                    "type": "error",
                    "message": f"배포 실패 (코드: {self._process.returncode})",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
        except Exception as e:
            yield {
                "type": "error",
                "message": f"Docker Compose 실행 오류: {str(e)}",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }

    def terminate(self):
        if hasattr(self, "_process") and self._process:
            self._process.terminate()

    def down(self):
        try:
            subprocess.run(
                ["docker", "compose", "-f", str(self.compose_file), "down"],
                cwd=str(self.compose_dir),
                capture_output=True
            )
        except Exception as e:
            raise Exception(f"Docker Compose down 실패: {str(e)}")
