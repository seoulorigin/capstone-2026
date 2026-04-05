import { useEffect, useState } from "react"
import { useContainers } from "@/hooks/useContainers"
import ContainerListSection from "@/components/dashboard/ContainerListSection"
import DetailPanelSection from "@/components/dashboard/DetailPanelSection"

// 대시보드에서 컨테이너 목록과 선택된 컨테이너의 상세 정보를 함께 관리한다.
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("metrics")
  const [selectedContainer, setSelectedContainer] = useState(null)

  const {
    data: containerData,
    isLoading: isContainersLoading,
    isError: isContainersError,
    error: containersError,
  } = useContainers()

  const containers = Array.isArray(containerData)
    ? containerData
    : containerData?.containers ?? []

  // 컨테이너 목록이 로드되면 첫 번째 컨테이너를 기본 선택한다.
  useEffect(() => {
    if (containers.length > 0 && !selectedContainer) {
      setSelectedContainer(containers[0])
    }
  }, [containers, selectedContainer])

  const selectedContainerId =
    selectedContainer?.container_id ?? selectedContainer?.id ?? null

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            서버에 존재하는 컨테이너 목록과 현재 상태를 확인하고, 선택한
            컨테이너의 리소스 메트릭을 모니터링할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-6">
          <ContainerListSection
            containers={containers}
            isLoading={isContainersLoading}
            isError={isContainersError}
            error={containersError}
            selectedContainerId={selectedContainerId}
            onSelectContainer={setSelectedContainer}
          />
        </div>

        <DetailPanelSection
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          selectedContainer={selectedContainer}
        />
      </div>
    </div>
  )
}