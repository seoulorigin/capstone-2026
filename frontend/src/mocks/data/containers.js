// 컨테이너 목록 mock 데이터
// backend /container/ 및 /container/test 응답 형태 기준:
// id, name, image, status, updated_at

export const mockContainers = [
  {
    id: "c1a2b3",
    name: "nginx-web",
    image: "nginx:latest",
    status: "running",
    updated_at: "2026-04-06T09:00:00.000Z",
  },
  {
    id: "c2b3d4",
    name: "postgres-db",
    image: "postgres:15",
    status: "running",
    updated_at: "2026-04-06T09:01:30.000Z",
  },
  {
    id: "c3d4e5",
    name: "redis-cache",
    image: "redis:7",
    status: "restarting",
    updated_at: "2026-04-06T09:02:10.000Z",
  },
  {
    id: "c4e5f6",
    name: "prometheus",
    image: "prom/prometheus:latest",
    status: "stopped",
    updated_at: "2026-04-06T08:58:20.000Z",
  },
  {
    id: "c5f6g7",
    name: "grafana",
    image: "grafana/grafana:latest",
    status: "paused",
    updated_at: "2026-04-06T08:55:00.000Z",
  },
  {
    id: "c6g7h8",
    name: "worker-service",
    image: "myapp/worker:1.0.0",
    status: "exited",
    updated_at: "2026-04-06T08:50:45.000Z",
  },
]