import StatusBadge from "@/components/dashboard/StatusBadge"
import MetricDonutChart from "@/components/dashboard/MetricDonutChart"
import PanelMessage from "@/components/dashboard/PanelMessage"
import InfoChip from "@/components/dashboard/InfoChip"
import MetricInfoCard from "@/components/dashboard/MetricInfoCard"
import MonitoringConnectionBadge from "@/components/monitoring/MonitoringConnectionBadge"
import MonitoringSourceBadge from "@/components/monitoring/MonitoringSourceBadge"

// 선택된 컨테이너의 WebSocket 메트릭 정보를 요약하여 표시하는 preview 패널
export default function MetricsPreviewPanel({
  selectedContainer,
  selectedContainerId,
  metricsResult,
}) {
  const {
    latestMetric = null,
    history = [],
    source = "mock-fallback",
    connectionStatus = "idle",
    realConnectionStatus = null,
    realError = null,
  } = metricsResult ?? {}

  const cpuPercent = latestMetric?.cpu_percent ?? 0
  const memoryUsageMb = latestMetric?.memory_usage_mb ?? 0
  const memoryLimitMb = latestMetric?.memory_limit_mb ?? 0

  const memoryPercent =
    latestMetric?.memory_percent ??
    (memoryLimitMb > 0 ? (memoryUsageMb / memoryLimitMb) * 100 : 0)

  const lastUpdated = latestMetric?.timestamp
    ? new Date(latestMetric.timestamp).toLocaleTimeString()
    : latestMetric?.time ?? "-"

  const hasMetric = Boolean(latestMetric)
  const shouldShowLoading =
    selectedContainer && connectionStatus === "connecting" && !hasMetric

  const shouldShowError =
    source === "real" && connectionStatus === "error" && !hasMetric

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
        <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.95),rgba(2,6,23,0.95))] p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-400">
                  Selected Container
                </p>
              </div>

              <div className="space-y-1">
                <p className="truncate text-2xl font-semibold tracking-tight text-slate-50">
                  {selectedContainer.name}
                </p>
                <p className="truncate text-sm text-slate-400">
                  {selectedContainer.image}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selectedContainer.status} />
              <MonitoringSourceBadge source={source} />
              <MonitoringConnectionBadge status={connectionStatus} />
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-400">
                마지막 갱신 {lastUpdated}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-4 md:grid-cols-3">
          <InfoChip label="Container ID" value={String(selectedContainerId)} />
          <InfoChip label="Image" value={selectedContainer.image} truncate />
          <InfoChip
            label="Status"
            value={selectedContainer.status ?? "unknown"}
          />
        </div>
      </div>

      {shouldShowLoading ? (
        <PanelMessage message="WebSocket 메트릭을 연결하는 중입니다." />
      ) : shouldShowError ? (
        <PanelMessage
          variant="error"
          message={
            realError?.message ??
            "WebSocket 메트릭을 불러오지 못했습니다. 재연결을 시도해 주세요."
          }
        />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <MetricDonutChart
              title="CPU 사용량"
              percent={cpuPercent}
              primaryText={`${cpuPercent.toFixed(1)}%`}
              secondaryText={`마지막 갱신: ${lastUpdated}`}
              color="#06b6d4"
            />

            <MetricDonutChart
              title="메모리 사용량"
              percent={memoryPercent}
              primaryText={`${memoryUsageMb.toFixed(
                1
              )} / ${memoryLimitMb.toFixed(1)} MB`}
              secondaryText={`마지막 갱신: ${lastUpdated}`}
              color="#22c55e"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricInfoCard label="CPU" value={`${cpuPercent.toFixed(1)}%`} />
            <MetricInfoCard
              label="Memory Used"
              value={`${memoryUsageMb.toFixed(1)} MB`}
            />
            <MetricInfoCard
              label="Memory Limit"
              value={`${memoryLimitMb.toFixed(1)} MB`}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricInfoCard label="Metric Source" value={getSourceLabel(source)} />
            <MetricInfoCard
              label="WS Status"
              value={connectionStatus ?? "idle"}
            />
            <MetricInfoCard
              label="History"
              value={`${history.length} points`}
            />
          </div>

          {source === "mock-fallback" && realConnectionStatus ? (
            <PanelMessage
              message={`실제 WebSocket 상태는 ${realConnectionStatus}이며, 현재 mock fallback 메트릭을 표시하고 있습니다.`}
            />
          ) : null}
        </>
      )}
    </div>
  )
}

function getSourceLabel(source) {
  if (source === "real") return "REAL WS"
  if (source === "mock-fallback") return "MOCK FALLBACK"
  if (source === "mock") return "MOCK"
  return String(source ?? "unknown")
}