import asyncio
import docker
import subprocess
import tempfile
import os
import yaml
from docker.errors import NotFound, APIError
from fastapi import HTTPException

from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta


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

    # 컨테이너 정보 포맷
    def _format_container(self, container) -> dict:
        return {
            "id": container.id[:12],
            "name": container.name,
            "image": container.attrs["Config"]["Image"],
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
        except Exception:
            return {"id": container_id[:12], "status": "error"}

    def get_container_logs_json(self, container_id: str):
        # 로그를 JSON 구조화된 형태로 반환 (KST 시간 적용)
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
        # YAML 문자열을 받아 docker-compose CLI로 배포
        try:
            yaml.safe_load(yaml_text)
        except yaml.YAMLError as e:
            raise HTTPException(
                status_code=400,
                detail={"status": "error", "message": f"유효하지 않은 YAML입니다: {e}"},
            )

        with tempfile.NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
            f.write(yaml_text)
            tmp_path = f.name

        loop = asyncio.get_event_loop()

        def run_compose():
            try:
                result = subprocess.run(
                    ["docker-compose", "-f", tmp_path, "up", "-d"],
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0:
                    raise RuntimeError(result.stderr.strip())
                return result.stdout
            finally:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)

        try:
            output = await loop.run_in_executor(None, run_compose)
            return {"status": "success", "message": "Compose 배포가 완료되었습니다.", "output": output}
        except RuntimeError as e:
            raise HTTPException(
                status_code=500,
                detail={"status": "error", "message": str(e)},
            )

    # Docker Compose (SDK 방식)
    def _parse_compose_file(self, compose_file: str) -> dict:
        # compose 파일을 파싱해 dict로 반환
        with open(compose_file, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)

    def _get_compose_containers(self, project_name: str) -> list:
        # compose 프로젝트의 컨테이너 목록 조회
        return self.client.containers.list(
            all=True,
            filters={"label": f"com.docker.compose.project={project_name}"}
        )

    def compose_up(self, compose_file: str, project_name: str) -> list:
        # compose 파일을 파싱해 네트워크·볼륨·컨테이너를 SDK로 생성/시작
        config = self._parse_compose_file(compose_file)
        compose_dir = os.path.dirname(os.path.abspath(compose_file))

        # 기본 네트워크 생성
        default_net_name = f"{project_name}_default"
        try:
            default_net = self.client.networks.get(default_net_name)
        except NotFound:
            default_net = self.client.networks.create(
                default_net_name,
                driver="bridge",
                labels={
                    "com.docker.compose.project": project_name,
                    "com.docker.compose.network": "default",
                },
            )
        networks = {"default": default_net}

        # 명시된 네트워크 생성
        for net_name, net_cfg in config.get("networks", {}).items():
            full_name = f"{project_name}_{net_name}"
            try:
                net = self.client.networks.get(full_name)
            except NotFound:
                cfg = net_cfg or {}
                net = self.client.networks.create(
                    full_name,
                    driver=cfg.get("driver", "bridge"),
                    labels={
                        "com.docker.compose.project": project_name,
                        "com.docker.compose.network": net_name,
                    },
                )
            networks[net_name] = net

        # 명시된 볼륨 생성
        for vol_name in config.get("volumes", {}):
            full_name = f"{project_name}_{vol_name}"
            try:
                self.client.volumes.get(full_name)
            except NotFound:
                self.client.volumes.create(
                    full_name,
                    labels={
                        "com.docker.compose.project": project_name,
                        "com.docker.compose.volume": vol_name,
                    },
                )

        # 서비스별 컨테이너 생성·시작
        started = []
        for service_name, svc in config.get("services", {}).items():
            container_name = f"{project_name}-{service_name}-1"

            # 이미 존재하면 실행만
            try:
                container = self.client.containers.get(container_name)
                if container.status != "running":
                    container.start()
                    container.reload()
                started.append(self._format_compose_container(container))
                continue
            except NotFound:
                pass

            image = svc.get("image")
            if not image:
                raise ValueError(f"서비스 '{service_name}'에 image가 지정되지 않았습니다.")

            try:
                self.client.images.get(image)
            except NotFound:
                self.client.images.pull(image)

            # 환경변수 (list/dict 모두 처리)
            env = svc.get("environment", {})
            if isinstance(env, list):
                env = {
                    (e.split("=", 1)[0]): (e.split("=", 1)[1] if "=" in e else os.environ.get(e, ""))
                    for e in env
                }

            # 포트 바인딩: "8080:80" → {"80": "8080"}
            port_bindings = {}
            for p in svc.get("ports", []):
                if isinstance(p, str) and ":" in p:
                    host, ctr = p.rsplit(":", 1)
                    port_bindings[ctr] = host

            # 볼륨 바인딩
            binds = []
            for v in svc.get("volumes", []):
                if isinstance(v, str):
                    parts = v.split(":")
                    src = parts[0]
                    tgt = parts[1] if len(parts) > 1 else parts[0]
                    if src.startswith("."):
                        src = os.path.normpath(os.path.join(compose_dir, src))
                    elif not src.startswith("/") and not src.startswith("~"):
                        src = f"{project_name}_{src}"
                    binds.append(f"{src}:{tgt}")

            # 레이블
            labels = {
                "com.docker.compose.project": project_name,
                "com.docker.compose.service": service_name,
                "com.docker.compose.version": "2",
                "com.docker.compose.container-number": "1",
            }
            svc_labels = svc.get("labels", {})
            if isinstance(svc_labels, list):
                svc_labels = {l.split("=", 1)[0]: l.split("=", 1)[1] for l in svc_labels if "=" in l}
            labels.update(svc_labels)

            # 첫 번째 네트워크에 연결
            svc_nets = svc.get("networks", ["default"])
            if isinstance(svc_nets, dict):
                svc_nets = list(svc_nets.keys())
            first_net = svc_nets[0] if svc_nets else "default"
            first_net_name = f"{project_name}_{first_net}" if first_net != "default" else default_net_name

            restart_cfg = svc.get("restart", "no")
            restart_policy = {"Name": restart_cfg} if restart_cfg and restart_cfg != "no" else None

            container = self.client.containers.run(
                image,
                name=container_name,
                environment=env,
                ports=port_bindings,
                volumes=binds,
                labels=labels,
                detach=True,
                network=first_net_name,
                restart_policy=restart_policy,
                command=svc.get("command"),
            )
            container.reload()

            # 추가 네트워크 연결
            for net_key in svc_nets[1:]:
                net_full = f"{project_name}_{net_key}" if net_key != "default" else default_net_name
                try:
                    self.client.networks.get(net_full).connect(container)
                except APIError:
                    pass

            started.append(self._format_compose_container(container))

        return started

    def compose_down(self, project_name: str, remove_volumes: bool = False) -> dict:
        # compose 프로젝트의 컨테이너·네트워크(·볼륨)를 SDK로 제거
        for c in self._get_compose_containers(project_name):
            if c.status == "running":
                c.stop()
            c.remove()

        for net in self.client.networks.list(
            filters={"label": f"com.docker.compose.project={project_name}"}
        ):
            try:
                net.remove()
            except APIError:
                pass

        if remove_volumes:
            for vol in self.client.volumes.list(
                filters={"label": f"com.docker.compose.project={project_name}"}
            ):
                vol.remove()

        return {"project": project_name, "status": "down", "removed_volumes": remove_volumes}

    def compose_ps(self, project_name: str) -> list:
        # compose 프로젝트의 서비스 컨테이너 목록 조회
        return [self._format_compose_container(c) for c in self._get_compose_containers(project_name)]

    def compose_logs(self, project_name: str, service_name: str = None, tail: int = 100) -> dict:
        # compose 프로젝트(또는 특정 서비스)의 로그 조회
        label_filter = [f"com.docker.compose.project={project_name}"]
        if service_name:
            label_filter.append(f"com.docker.compose.service={service_name}")

        containers = self.client.containers.list(
            all=True, filters={"label": label_filter}
        )
        return {
            c.labels.get("com.docker.compose.service", c.name): c.logs(tail=tail).decode("utf-8", errors="replace")
            for c in containers
        }

    def _format_compose_container(self, container) -> dict:
        # Compose 컨테이너 정보 포맷
        labels = container.labels
        return {
            "id": container.id[:12],
            "name": container.name,
            "service": labels.get("com.docker.compose.service", ""),
            "project": labels.get("com.docker.compose.project", ""),
            "image": container.attrs["Config"]["Image"],
            "status": container.status,
        }

    # DB 동기화

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
