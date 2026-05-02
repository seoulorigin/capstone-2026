import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MonitoringLineChart from "@/components/monitoring/MonitoringLineChart"
import MonitoringSourceBadge from "@/components/monitoring/MonitoringSourceBadge"
import MonitoringConnectionBadge from "@/components/monitoring/MonitoringConnectionBadge"

export default function MonitoringChartPanel({
  selectedContainer,
  metricsResult,
}) {
  const {
    history = [],
    latestMetric = null,
    source = "mock-fallback",
    connectionStatus = "idle",
    reconnect = () => {},
  } = metricsResult ?? {}

  return (
    <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
              CPU / Memory 라인차트
            </CardTitle>
            <p className="mt-2 text-sm text-slate-400">
              WebSocket 연결 성공 시 real 데이터를 사용하고, 연결 전에는 mock
              fallback 데이터를 표시합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <MonitoringSourceBadge source={source} />
            <MonitoringConnectionBadge status={connectionStatus} />

            <span className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
              Recharts
            </span>

            <Button
              type="button"
              variant="outline"
              onClick={reconnect}
              disabled={!selectedContainer || connectionStatus === "connecting"}
              className="h-8 border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50 disabled:opacity-50"
            >
              {connectionStatus === "connecting" ? "연결 중" : "WS 재연결"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!selectedContainer ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
            컨테이너를 선택하면 CPU / Memory 라인차트가 표시됩니다.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <MonitoringLineChart
                title="CPU Usage"
                description="cpu_percent"
                data={history}
                dataKey="cpu_percent"
                valueSuffix="%"
                accentColor="#22d3ee"
              />

              <MonitoringLineChart
                title="Memory Usage"
                description="memory_percent"
                data={history}
                dataKey="memory_percent"
                valueSuffix="%"
                accentColor="#22c55e"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <MetricSnapshotCard
                label="CPU"
                value={
                  latestMetric
                    ? `${latestMetric.cpu_percent.toFixed(1)}%`
                    : "--%"
                }
                helper="현재 CPU 사용률"
                tone="cyan"
              />

              <MetricSnapshotCard
                label="Memory Used"
                value={
                  latestMetric
                    ? `${latestMetric.memory_usage_mb.toFixed(1)} MB`
                    : "-- MB"
                }
                helper="현재 메모리 사용량"
                tone="emerald"
              />

              <MetricSnapshotCard
                label="Memory Limit"
                value={
                  latestMetric
                    ? `${latestMetric.memory_limit_mb.toFixed(1)} MB`
                    : "-- MB"
                }
                helper="메모리 한도"
                tone="slate"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MetricSnapshotCard({ label, value, helper, tone = "slate" }) {
  const toneClassName =
    tone === "cyan"
      ? "border-cyan-500/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]"
      : tone === "emerald"
      ? "border-emerald-500/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.10),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]"
      : "border-slate-700 bg-[radial-gradient(circle_at_top_left,rgba(100,116,139,0.12),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]"

  const dotClassName =
    tone === "cyan"
      ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
      : tone === "emerald"
      ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
      : "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.45)]"

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClassName}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  )
}