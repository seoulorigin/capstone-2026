import { useMockContainerMetricHistory } from "@/hooks/useMockContainerMetricHistory"

// 추후 WebSocket 확정 시 이 파일 내부만 교체하면 됩니다.
// 현재는 mock history hook을 그대로 반환합니다.
export function useContainerMetricHistory(selectedContainer) {
  return useMockContainerMetricHistory(selectedContainer)
}