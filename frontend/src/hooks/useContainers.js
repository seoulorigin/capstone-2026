import { useQuery } from "@tanstack/react-query"
import { getContainers } from "@/api/containerApi"

// 선택된 프로젝트 기준으로 컨테이너 목록 조회를 관리하는 커스텀 훅
export function useContainers(projectId) {
  return useQuery({
    queryKey: ["containers", projectId],
    queryFn: () => getContainers(projectId),
    enabled: projectId !== null,
  })
}