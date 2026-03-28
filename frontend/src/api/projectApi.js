import { api } from "./client"

// 프로젝트 목록을 조회하는 API 함수
export async function getProjects() {
  const response = await api.get("/projects")
  return response.data
}