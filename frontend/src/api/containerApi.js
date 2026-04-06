import { api } from "./client"
import axios from "axios"
import { mockContainers } from "@/mocks/data/containers"

const USE_CONTAINERS_MOCK =
  import.meta.env.VITE_USE_CONTAINERS_MOCK === "true"

const USE_STATS_MOCK =
  import.meta.env.VITE_USE_STATS_MOCK === "true"

// 컨테이너 목록을 실제 API에서 조회하고,
// UI 작업 시에는 환경 변수로 mock 데이터를 사용할 수 있다.
export async function getContainers() {
  if (USE_CONTAINERS_MOCK) {
    return mockContainers
  }

  try {
    const response = await api.get("/container/")
    return response.data
  } catch (e) {
    // 협의된 fallback 엔드포인트 유지
    const response = await api.get("/container/test")
    return response.data
  }
}

// 선택된 컨테이너의 리소스 메트릭을 조회한다.
// mock 사용 시에는 MSW handlers의 /containers/:containerId/stats 응답을 사용한다.
export async function getContainerStats(containerId) {
  if (USE_STATS_MOCK) {
    const response = await axios.get(`/containers/${containerId}/stats`)
    return response.data
  }

  const response = await api.get(`/containers/${containerId}/stats`)
  return response.data
}