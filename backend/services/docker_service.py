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
    
    # 컨테이너 logs 가져오기 (ver. raw)
    def get_container_logs(self, container_id: str, tail: int = 100, timestamps: bool = True) -> str:
        # : param tail : 출력할 마지막 로그의 줄 수 (default: 100)
        container = self.client.containers.get(container_id)

        log_bytes = container.logs(
            stdout=True,
            stderr=True,
            tail=tail,
            timestamps=timestamps,
            stream=False
        )

        return log_bytes.decode('utf-8', errors='replace')

    # 컨테이너 logs 가져오기 (ver. JSON 구조화)
    def get_container_logs_json(self, container_id: str, tail: int = 100, timestamps: bool = True) -> list:
        # : param tail : 출력할 마지막 로그의 줄 수 (default: 100)

        container = self.client.containers.get(container_id)
        
        log_bytes = container.logs(
            stdout=True,
            stderr=True,
            tail=tail,
            timestamps=timestamps
            stream=False
        )
        
        raw_lines = log_bytes.decode('utf-8', errors='replace').strip().split('\n')
        
        parsed_logs = []
        for line in raw_lines:
            if not line:
                continue
            
            # 첫 번째 공백을 기준으로 타임스탬프와 메시지를 분리
            parts = line.split(" ", 1)
            
            timestamp_str = parts[0]
            message = parts[1] if len(parts) > 1 else ""
            
            # 로그 레벨 추출
            # !로직 수정 필요!
            msg_upper = message.upper()
            level = "INFO" # 기본값
            
            if "ERROR" in msg_upper or "ERR" in msg_upper or "EXCEPTION" in msg_upper:
                level = "ERROR"
            elif "WARN" in msg_upper:
                level = "WARN"
            elif "DEBUG" in msg_upper:
                level = "DEBUG"
            else:
                level = "ETC" # 수정 필요
                
            parsed_logs.append({
                "timestamp": timestamp_str,
                "level": level,
                "message": message.strip()
            })
            
        return parsed_logs