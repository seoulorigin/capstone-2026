import { http, HttpResponse } from "msw"
import { projects } from "./data/projects"

export const handlers = [
  // MSW 동작 여부를 확인하기 위한 테스트용 엔드포인트
  http.get("/api/health", () => {
    return HttpResponse.json({
      message: "MSW is running",
    })
  }),

  // 프로젝트 목록 조회 요청에 대해 mock 데이터를 반환
  http.get("/projects", () => {
    return HttpResponse.json({
      projects,
    })
  }),
]