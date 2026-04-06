import { api } from "./client"
import axios from "axios"
import { mockContainers } from "@/mocks/data/containers"

/**
 * env 값 처리 규칙
 * - undefined → 기본값 적용
 * - "true" / "false" 명시 시에만 override
 */

// 컨테이너 목록: 기본은 실제 API
const USE_CONTAINERS_MOCK =
  import.meta.env.VITE_USE_CONTAINERS_MOCK === "true"

// stats: 기본은 mock (중요)
const USE_STATS_MOCK =
  import.meta.env.VITE_USE_STATS_MOCK !== "false"

/**
 * 컨테이너 목록 조회
 */
export async function getContainers() {
  if (USE_CONTAINERS_MOCK) {
    return mockContainers
  }

  try {
    const response = await api.get("/container/")
    return response.data
  } catch (e) {
    // fallback 엔드포인트 유지
    const response = await api.get("/container/test")
    return response.data
  }
}

/**
 * 컨테이너 리소스 메트릭 조회
 */
export async function getContainerStats(containerId) {
  if (USE_STATS_MOCK) {
    const response = await axios.get(`/containers/${containerId}/stats`)
    return response.data
  }

  const response = await api.get(`/containers/${containerId}/stats`)
  return response.data
}