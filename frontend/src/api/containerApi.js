import { api } from "./client"
import axios from "axios"

const USE_MOCK = true

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

// 선택된 컨테이너의 리소스 메트릭을 조회
export async function getContainerStats(containerId) {
  const response = USE_MOCK
    ? await axios.get(`/containers/${containerId}/stats`)
    : await api.get(`/containers/${containerId}/stats`)

  return response.data
}