// 프로젝트별 컨테이너 목록 mock 데이터
// 계획서(DBML)의 container 테이블 기준 반영:
// id, project_id, compose_file_id, name, image, status, updated_at

export const containersByProject = {
  1: [
    {
      id: 1,
      project_id: 1,
      compose_file_id: 1,
      name: "nginx",
      image: "nginx:latest",
      status: "running",
      updated_at: "2026-03-29T12:00:00.000Z",
    },
  ],
  2: [
    {
      id: 2,
      project_id: 2,
      compose_file_id: 2,
      name: "nginx",
      image: "nginx:latest",
      status: "running",
      updated_at: "2026-03-29T12:03:00.000Z",
    },
    {
      id: 3,
      project_id: 2,
      compose_file_id: 2,
      name: "postgres",
      image: "postgres:15",
      status: "stopped",
      updated_at: "2026-03-29T12:05:00.000Z",
    },
  ],
  3: [
    {
      id: 4,
      project_id: 3,
      compose_file_id: 3,
      name: "nginx",
      image: "nginx:latest",
      status: "running",
      updated_at: "2026-03-29T12:10:00.000Z",
    },
    {
      id: 5,
      project_id: 3,
      compose_file_id: 3,
      name: "postgres",
      image: "postgres:15",
      status: "running",
      updated_at: "2026-03-29T12:12:00.000Z",
    },
    {
      id: 6,
      project_id: 3,
      compose_file_id: 3,
      name: "redis",
      image: "redis:7",
      status: "restarting",
      updated_at: "2026-03-29T12:14:00.000Z",
    },
  ],
}