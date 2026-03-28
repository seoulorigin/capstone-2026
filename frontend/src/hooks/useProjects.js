import { useQuery } from "@tanstack/react-query"
import { getProjects } from "@/api/projectApi"

// 프로젝트 목록 조회를 TanStack Query로 관리하는 커스텀 훅
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  })
}