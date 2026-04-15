import { useMemo } from "react"

const INACTIVE_STATUSES = ["stopped", "exited", "paused"]

// 컨테이너 목록을 기반으로 상태별 개수를 계산하는 hook
export function useContainerSummary(containers = []) {
  return useMemo(() => {
    const total = containers.length

    const running = containers.filter((container) => {
      return String(container.status ?? "").toLowerCase() === "running"
    }).length

    const restarting = containers.filter((container) => {
      return String(container.status ?? "").toLowerCase() === "restarting"
    }).length

    const inactive = containers.filter((container) => {
      return INACTIVE_STATUSES.includes(
        String(container.status ?? "").toLowerCase()
      )
    }).length

    return {
      total,
      running,
      restarting,
      inactive,
    }
  }, [containers])
}