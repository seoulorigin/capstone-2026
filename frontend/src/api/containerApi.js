import { api } from "./client"

// 선택된 프로젝트의 컨테이너 목록을 조회하는 API 함수
export async function getContainers(projectId) {
  const response = await api.get(`/projects/${projectId}/containers`)
  return response.data
}