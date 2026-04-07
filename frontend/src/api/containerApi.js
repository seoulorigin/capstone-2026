import { api } from "./client"
import axios from "axios"
import { mockContainers } from "@/mocks/data/containers"

// env 기반 설정 유지
const USE_CONTAINERS_MOCK =
  import.meta.env.VITE_USE_CONTAINERS_MOCK === "true"

const USE_STATS_MOCK =
  import.meta.env.VITE_USE_STATS_MOCK !== "false"

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

export async function getContainerStats(containerId) {
  if (USE_STATS_MOCK) {
    const response = await axios.get(`/containers/${containerId}/stats`)
    return response.data
  }

  const response = await api.get(`/containers/${containerId}/stats`)
  return response.data
}