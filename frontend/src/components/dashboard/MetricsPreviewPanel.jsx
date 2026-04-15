import StatusBadge from "@/components/dashboard/StatusBadge"
import MetricDonutChart from "@/components/dashboard/MetricDonutChart"
import PanelMessage from "@/components/dashboard/PanelMessage"
import InfoChip from "@/components/dashboard/InfoChip"
import MetricInfoCard from "@/components/dashboard/MetricInfoCard"

// 선택된 컨테이너의 메트릭 정보를 요약하여 표시하는 preview 패널
export default function MetricsPreviewPanel({
  selectedContainer,
  selectedContainerId,
  stats,
  isLoading,
  isError,
  error,
}) {
    // 메트릭 값 계산 (API 응답 기준 fallback 포함)
  const cpuPercent = stats?.cpu_percent ?? 0
  const memoryMb = stats?.memory_mb ?? 0
  const memoryLimitMb = stats?.memory_limit_mb ?? 0

  const memoryPercent =
    memoryLimitMb > 0 ? (memoryMb / memoryLimitMb) * 100 : 0

  const lastUpdated = new Date(
    stats?.timestamp ?? Date.now()
  ).toLocaleTimeString()

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

      {isLoading ? (
        <PanelMessage message="리소스 메트릭을 불러오는 중입니다." />
      ) : isError ? (
        <PanelMessage
          variant="error"
          message={error?.message ?? "리소스 메트릭을 불러오지 못했습니다."}
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
              primaryText={`${memoryMb.toFixed(1)} / ${memoryLimitMb.toFixed(
                1
              )} MB`}
              secondaryText={`마지막 갱신: ${lastUpdated}`}
              color="#22c55e"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricInfoCard label="CPU" value={`${cpuPercent.toFixed(1)}%`} />
            <MetricInfoCard
              label="Memory Used"
              value={`${memoryMb.toFixed(1)} MB`}
            />
            <MetricInfoCard
              label="Memory Limit"
              value={`${memoryLimitMb.toFixed(1)} MB`}
            />
          </div>
        </>
      )}
    </div>
  )
}