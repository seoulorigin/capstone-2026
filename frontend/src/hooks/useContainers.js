import { useQuery } from "@tanstack/react-query"
import { getContainers } from "@/api/containerApi"

// 컨테이너 목록 조회를 TanStack Query로 관리
// options를 통해 화면별 polling/refetch 정책을 조정할 수 있다.
export function useContainers(options = {}) {
  return useQuery({
    queryKey: ["containers"],
    queryFn: getContainers,
    ...options,
  })
}