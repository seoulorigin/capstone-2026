// 프로젝트 목록 조회 API에서 사용할 mock 프로젝트 데이터
export const projects = [
  {
    id: 1,
    name: "web_only",
    description: "Nginx 단일 컨테이너로 구성된 프로젝트",
    created_at: "2026-03-28T09:00:00.000Z",
  },
  {
    id: 2,
    name: "web_db",
    description: "Nginx와 Postgres로 구성된 프로젝트",
    created_at: "2026-03-27T09:00:00.000Z",
  },
  {
    id: 3,
    name: "web_db_cache",
    description: null,
    created_at: "2026-03-26T09:00:00.000Z",
  },
]