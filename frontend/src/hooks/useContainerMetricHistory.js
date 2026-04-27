import { useMockContainerMetricHistory } from "@/hooks/useMockContainerMetricHistory"
import { useContainerMetricsWebSocket } from "@/hooks/useContainerMetricsWebSocket"

const MONITORING_MODE =
  import.meta.env.VITE_MONITORING_METRICS_MODE ?? "auto"

// mode:
// - "mock": 항상 mock 사용
// - "real": 실제 WebSocket만 사용
// - "auto": WebSocket 연결 성공 시 real, 실패/미연결 시 mock 사용
export function useContainerMetricHistory(selectedContainer) {
  const mockResult = useMockContainerMetricHistory(selectedContainer)
  const realResult = useContainerMetricsWebSocket(selectedContainer)

  if (MONITORING_MODE === "mock") {
    return {
      ...mockResult,
      source: "mock",
      connectionStatus: "mock",
    }
  }

  if (MONITORING_MODE === "real") {
    return {
      ...realResult,
      source: "real",
    }
  }

  const shouldUseReal =
    realResult.connectionStatus === "connected" &&
    realResult.history.length > 0

  if (shouldUseReal) {
    return {
      ...realResult,
      source: "real",
    }
  }

  return {
    ...mockResult,
    source: "mock-fallback",
    connectionStatus: realResult.connectionStatus,
    realError: realResult.error,
  }
}