import { useMockContainerLogs } from "@/hooks/useMockContainerLogs"
import { useContainerLogsWebSocket } from "@/hooks/useContainerLogsWebSocket"

const MONITORING_MODE =
  import.meta.env.VITE_MONITORING_LOGS_MODE ?? "auto"

// mock 전용 hook 결과를 반환합니다.
function useMockLogsOnly(selectedContainer) {
  const mockResult = useMockContainerLogs(selectedContainer)

  return {
    ...mockResult,
    source: "mock",
    connectionStatus: "mock",
    realError: null,
    reconnect: () => {},
  }
}

// real 또는 auto 모드에서 logs WebSocket과 mock fallback을 함께 관리합니다.
function useAutoLogs(selectedContainer) {
  const mockResult = useMockContainerLogs(selectedContainer)
  const realResult = useContainerLogsWebSocket(selectedContainer)

  if (MONITORING_MODE === "real") {
    return {
      ...realResult,
      source: "real",
    }
  }

  const shouldUseReal =
    realResult.connectionStatus === "connected" &&
    realResult.logs.length > 0

  if (shouldUseReal) {
    return {
      ...realResult,
      source: "real",
    }
  }

  return {
    ...mockResult,
    source: "mock-fallback",
    connectionStatus: "fallback",
    realConnectionStatus: realResult.connectionStatus,
    realError: realResult.error,
    reconnect: realResult.reconnect,
  }
}

// 로그 모드에 따라 mock-only 또는 real/auto 로그 처리를 선택합니다.
export function useContainerLogs(selectedContainer) {
  if (MONITORING_MODE === "mock") {
    return useMockLogsOnly(selectedContainer)
  }

  return useAutoLogs(selectedContainer)
}