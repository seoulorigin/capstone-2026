// src/api/containerApi.js

import { api } from "./client"
import axios from "axios"
import { mockContainers } from "@/mocks/data/containers"

// 컨테이너 목록 mock 사용 여부를 env 값으로 결정합니다.
const USE_CONTAINERS_MOCK =
  import.meta.env.VITE_USE_CONTAINERS_MOCK === "true"

// 컨테이너 통계 mock 사용 여부를 env 값으로 결정합니다.
const USE_STATS_MOCK =
  import.meta.env.VITE_USE_STATS_MOCK === "true"

// 컨테이너 목록을 조회하고, 실패 시 테스트용 컨테이너 목록 API로 fallback합니다.
export async function getContainers() {
  if (USE_CONTAINERS_MOCK) {
    return mockContainers
  }

  try {
    const response = await api.get("/container/")
    return response.data
  } catch (e) {
    const response = await api.get("/container/test")
    return response.data
  }
}

// 특정 컨테이너의 현재 리소스 통계 정보를 조회합니다.
export async function getContainerStats(containerId) {
  if (USE_STATS_MOCK) {
    const response = await axios.get(`/container/${containerId}/stats`)
    return response.data
  }

  const response = await api.get(`/container/${containerId}/stats`)
  return response.data
}

// Docker Compose YAML 문자열을 백엔드로 전달하여 compose up 배포를 요청합니다.
export async function deployComposeYaml(yamlText) {
  const response = await api.post("/container/compose/up", {
    yaml: yamlText,
  })

  return response.data
}