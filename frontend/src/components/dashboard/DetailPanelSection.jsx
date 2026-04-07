import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StatusBadge from "@/components/dashboard/StatusBadge"
import MetricDonutChart from "@/components/dashboard/MetricDonutChart"
import { useContainerStats } from "@/hooks/useContainerStats"

// 선택된 컨테이너의 메트릭 또는 로그 영역을 표시한다.
export default function DetailPanelSection({
  activeTab,
  onChangeTab,
  selectedContainer,
}) {
  const selectedContainerId =
    selectedContainer?.container_id ?? selectedContainer?.id ?? null

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useContainerStats(selectedContainerId)

  const cpuPercent = stats?.cpu_percent ?? 0
  const memoryMb = stats?.memory_mb ?? 0
  const memoryLimitMb = stats?.memory_limit_mb ?? 0

  const memoryPercent =
    memoryLimitMb > 0 ? (memoryMb / memoryLimitMb) * 100 : 0

  const lastUpdated = new Date(
    stats?.timestamp ?? Date.now()
  ).toLocaleTimeString()

  return (
    <section>
      <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
                상세 정보
              </CardTitle>
              <p className="text-sm text-slate-400">
                선택된 컨테이너의 리소스 메트릭과 로그 영역을 확인합니다.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onChangeTab("metrics")}
                  className={`h-8 px-3 text-xs transition-all duration-150 hover:-translate-y-[1px] ${
                    activeTab === "metrics"
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.25)] hover:bg-cyan-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                  }`}
                >
                  메트릭
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onChangeTab("logs")}
                  className={`h-8 px-3 text-xs transition-all duration-150 hover:-translate-y-[1px] ${
                    activeTab === "logs"
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.25)] hover:bg-cyan-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                  }`}
                >
                  로그
                </Button>
              </div>

              {activeTab === "metrics" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={!selectedContainerId || isFetching}
                  className="h-8 border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50 disabled:opacity-50"
                >
                  {isFetching ? "..." : "새로고침"}
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>

        <CardContent className="animate-fade-in-up">
          {!selectedContainer ? (
            <PanelMessage message="컨테이너를 선택하면 상세 메트릭과 로그를 확인할 수 있습니다." />
          ) : activeTab === "metrics" ? (
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
                  <InfoChip
                    label="Container ID"
                    value={String(selectedContainerId)}
                  />
                  <InfoChip
                    label="Image"
                    value={selectedContainer.image}
                    truncate
                  />
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
                    <MetricInfoCard
                      label="CPU"
                      value={`${cpuPercent.toFixed(1)}%`}
                    />
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
          ) : (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
                <div className="flex flex-col gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-100">
                        로그 스트림
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedContainer.name} · {selectedContainer.image}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                      mock preview
                    </span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      connected
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-3">
                  <ToolbarChip label="stdout" active />
                  <ToolbarChip label="최근순" />
                  <ToolbarChip label="자동 스크롤" />
                  <ToolbarChip label="필터 예정" />
                </div>

                <div className="max-h-[360px] space-y-2 overflow-y-auto bg-[#020617] p-4 font-mono text-sm">
                  <LogLine
                    time="12:00:01"
                    level="INFO"
                    message="Container process started successfully."
                  />
                  <LogLine
                    time="12:00:03"
                    level="INFO"
                    message="Health check endpoint registered."
                  />
                  <LogLine
                    time="12:00:05"
                    level="WARN"
                    message="Retrying upstream connection to dependent service."
                  />
                  <LogLine
                    time="12:00:08"
                    level="INFO"
                    message="Connection established with redis-cache."
                  />
                  <LogLine
                    time="12:00:11"
                    level="INFO"
                    message="Metrics polling loop initialized."
                  />
                  <LogLine
                    time="12:00:16"
                    level="ERROR"
                    message="Temporary timeout detected while reading resource usage."
                  />
                  <LogLine
                    time="12:00:19"
                    level="INFO"
                    message="Recovered from timeout and resumed normal operation."
                  />
                  <LogLine
                    time="12:00:25"
                    level="INFO"
                    message="Application ready to accept requests."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <MetricInfoCard label="Log Source" value="Container stdout" />
                <MetricInfoCard label="Current Mode" value="Preview" />
                <MetricInfoCard label="Streaming" value="Pending" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function PanelMessage({ message, variant = "default" }) {
  const className =
    variant === "error"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
      : "border-slate-800 bg-slate-950/70 text-slate-400"

  return (
    <div className={`rounded-2xl border p-4 text-sm ${className}`}>{message}</div>
  )
}

function MetricInfoCard({ label, value }) {
  const tone = getMetricCardTone(label)

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tone.panelToneClass}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${tone.dotClassName}`} />
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">{tone.helperText}</p>
    </div>
  )
}

function getMetricCardTone(label) {
  const normalizedLabel = String(label ?? "").toLowerCase()

  if (normalizedLabel.includes("cpu")) {
    return {
      dotClassName: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]",
      helperText: "현재 CPU 사용 상태",
      panelToneClass:
        "border-cyan-500/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  if (normalizedLabel.includes("memory used")) {
    return {
      dotClassName: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]",
      helperText: "현재 메모리 사용량",
      panelToneClass:
        "border-emerald-500/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.10),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  if (normalizedLabel.includes("memory limit")) {
    return {
      dotClassName: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.45)]",
      helperText: "할당된 메모리 한도",
      panelToneClass:
        "border-slate-700 bg-[radial-gradient(circle_at_top_left,rgba(100,116,139,0.12),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  return {
    dotClassName: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.45)]",
    helperText: "현재 메트릭 정보",
    panelToneClass:
      "border-slate-700 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
  }
}

function InfoChip({ label, value, truncate = false }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-sm font-medium text-slate-200 ${
          truncate ? "truncate" : ""
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function ToolbarChip({ label, active = false }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs ${
        active
          ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
          : "border-slate-700 bg-slate-900 text-slate-400"
      }`}
    >
      {label}
    </span>
  )
}

function LogLine({ time, level, message }) {
  const levelClassName =
    level === "ERROR"
      ? "text-rose-300"
      : level === "WARN"
      ? "text-amber-300"
      : "text-cyan-300"

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
      <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-3">
        <span className="shrink-0 text-xs text-slate-500">{time}</span>
        <span className={`shrink-0 text-xs font-semibold ${levelClassName}`}>
          {level}
        </span>
        <p className="min-w-0 text-sm text-slate-300">{message}</p>
      </div>
    </div>
  )
}