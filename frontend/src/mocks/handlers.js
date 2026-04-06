import { http, HttpResponse } from "msw"
import { projects } from "./data/projects"
import { containersByProject } from "./data/containers"

export const handlers = [
  // MSW 동작 여부를 확인하기 위한 테스트용 엔드포인트
  http.get("/api/health", () => {
    return HttpResponse.json({
      message: "MSW is running",
    })
  }),

  // 프로젝트 목록 조회 mock 응답
  http.get("/projects", () => {
    return HttpResponse.json({
      projects,
    })
  }),

  // 선택된 프로젝트의 컨테이너 목록 조회 mock 응답
  http.get("/projects/:projectId/containers", ({ params }) => {
    const projectId = Number(params.projectId)

    return HttpResponse.json({
      containers: containersByProject[projectId] ?? [],
    })
  }),
]