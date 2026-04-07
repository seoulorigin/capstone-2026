import { useQuery } from "@tanstack/react-query"
import { getContainerStats } from "@/api/containerApi"

// 선택된 컨테이너의 리소스 메트릭을 3초 간격 조회
export function useContainerStats(containerId) {
  return useQuery({
    queryKey: ["containerStats", containerId],
    queryFn: () => getContainerStats(containerId),
    enabled: !!containerId,
    refetchInterval: 3000,
  })
}