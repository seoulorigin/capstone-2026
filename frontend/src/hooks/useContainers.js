import { useQuery } from "@tanstack/react-query"
import { getContainers } from "@/api/containerApi"

// 컨테이너 목록 조회를 TanStack Query로 관리
export function useContainers() {
  return useQuery({
    queryKey: ["containers"],
    queryFn: getContainers,
  })
}