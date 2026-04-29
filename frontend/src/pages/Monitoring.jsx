import { useMemo, useState } from "react"
import MainLayout from "@/layouts/MainLayout"
import { useContainers } from "@/hooks/useContainers"
import { useContainerMetricHistory } from "@/hooks/useContainerMetricHistory"
import { useContainerLogs } from "@/hooks/useContainerLogs"
import MonitoringContainerList from "@/components/monitoring/MonitoringContainerList"
import MonitoringChartPanel from "@/components/monitoring/MonitoringChartPanel"
import MonitoringStatusCard from "@/components/monitoring/MonitoringStatusCard"
import MonitoringLogTerminal from "@/components/monitoring/MonitoringLogTerminal"

export default function Monitoring() {
  const {
    data: containerData,
    isLoading: isContainersLoading,
    isError: isContainersError,
    error: containersError,
  } = useContainers()

  const containers = useMemo(() => {
    return Array.isArray(containerData)
      ? containerData
      : containerData?.containers ?? []
  }, [containerData])

  const [selectedContainerId, setSelectedContainerId] = useState(null)

  const selectedContainer = useMemo(() => {
    if (containers.length === 0) return null

    if (!selectedContainerId) {
      return containers[0]
    }

    return (
      containers.find((container) => {
        const currentId = container.container_id ?? container.id
        return currentId === selectedContainerId
      }) ?? containers[0]
    )
  }, [containers, selectedContainerId])

  const metricsResult = useContainerMetricHistory(selectedContainer)
  const logsResult = useContainerLogs(selectedContainer)

  function handleSelectContainer(container) {
    const currentId = container.container_id ?? container.id
    setSelectedContainerId(currentId)
  }

  return (
    <MainLayout>
      <div className="space-y-7">
        <header className="overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_24%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
          <div className="p-7 xl:p-9">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-400">
                Detailed Monitoring
              </p>

              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                WebSocket Ready
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-50 xl:text-[42px]">
                상세 모니터링
              </h1>

              <p className="max-w-3xl text-sm leading-7 text-slate-400 xl:text-[15px]">
                선택한 컨테이너의 CPU, Memory 변화와 로그 스트림을 한 화면에서
                확인합니다. WebSocket 우선 연결 구조를 적용했으며, 연결 실패 시
                mock fallback으로 동작합니다.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <HeaderMetaChip
                label="Metrics"
                value="/container/ws/metrics/{container_id}"
              />
              <HeaderMetaChip
                label="Logs"
                value="/container/ws/logs/{container_id}"
              />
              <HeaderMetaChip label="Mode" value="Real WS + Mock Fallback" />
            </div>
          </div>
        </header>

        <div className="grid gap-7 xl:grid-cols-[360px_minmax(0,1fr)]">
          <MonitoringContainerList
            containers={containers}
            isLoading={isContainersLoading}
            isError={isContainersError}
            error={containersError}
            selectedContainer={selectedContainer}
            onSelectContainer={handleSelectContainer}
          />

          <section className="space-y-7">
            <MonitoringChartPanel
              selectedContainer={selectedContainer}
              metricsResult={metricsResult}
            />

            <MonitoringStatusCard
              selectedContainer={selectedContainer}
              metricsResult={metricsResult}
              logsResult={logsResult}
            />

            <MonitoringLogTerminal
              selectedContainer={selectedContainer}
              logsResult={logsResult}
            />
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

function HeaderMetaChip({ label, value }) {
  return (
    <div className="rounded-full border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-400 backdrop-blur-sm">
      <span className="mr-2 text-slate-500">{label}</span>
      <span className="text-slate-300">{value}</span>
    </div>
  )
}