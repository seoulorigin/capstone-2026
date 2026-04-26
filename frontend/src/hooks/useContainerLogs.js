import { useMockContainerLogs } from "@/hooks/useMockContainerLogs"

// 추후 WebSocket 확정 시 이 파일 내부만 교체하면 됩니다.
// 현재는 mock logs hook을 그대로 반환합니다.
export function useContainerLogs(selectedContainer) {
  return useMockContainerLogs(selectedContainer)
}