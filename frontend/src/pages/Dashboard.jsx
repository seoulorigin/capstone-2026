import { useState } from "react"
import { useContainers } from "@/hooks/useContainers"
import ContainerListSection from "@/components/dashboard/ContainerListSection"
import DetailPanelSection from "@/components/dashboard/DetailPanelSection"

// 대시보드에서 컨테이너 목록을 직접 조회하고 상세 패널 탭 상태를 관리
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("metrics")

  const {
    data: containerData,
    isLoading: isContainersLoading,
    isError: isContainersError,
    error: containersError,
  } = useContainers()

  // 배열 응답과 객체 래핑 응답을 모두 안전하게 처리
  const containers = Array.isArray(containerData)
    ? containerData
    : containerData?.containers ?? []

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            서버에 존재하는 컨테이너 목록과 현재 상태를 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-6">
          <ContainerListSection
            containers={containers}
            isLoading={isContainersLoading}
            isError={isContainersError}
            error={containersError}
          />
        </div>

        <DetailPanelSection
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      </div>
    </div>
  )
}