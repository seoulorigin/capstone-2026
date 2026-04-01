import { api } from "./client"

// 컨테이너 목록을 실제 API에서 조회하고
// 미완성 상태에서는 테스트 API로 대체
export async function getContainers() {
  try {
    const response = await api.get("/container/")
    return response.data
  } catch (e) {
    // fallback
    const response = await api.get("/container/test")
    return response.data
  }
}