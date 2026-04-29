import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatusBadge from "@/components/dashboard/StatusBadge"
import InfoChip from "@/components/dashboard/InfoChip"
import MonitoringConnectionBadge from "@/components/monitoring/MonitoringConnectionBadge"
import MonitoringSourceBadge from "@/components/monitoring/MonitoringSourceBadge"

export default function MonitoringStatusCard({
  selectedContainer,
  metricsResult,
  logsResult,
}) {
  const containerId =
    selectedContainer?.container_id ?? selectedContainer?.id ?? "-"

  const metricsStatus = metricsResult?.connectionStatus ?? "idle"
  const metricsSource = metricsResult?.source ?? "mock-fallback"

  const logsStatus = logsResult?.connectionStatus ?? "idle"
  const logsSource = logsResult?.source ?? "mock-fallback"

  const overallStatus = getOverallStatus(metricsStatus, logsStatus)

  return (
    <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
              선택 컨테이너 정보
            </CardTitle>
            <p className="mt-2 text-sm text-slate-400">
              현재 선택된 컨테이너와 WebSocket 연결 상태를 표시합니다.
            </p>
          </div>

          <MonitoringConnectionBadge status={overallStatus} />
        </div>
      </CardHeader>

      <CardContent>
        {!selectedContainer ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
            컨테이너를 선택하면 상세 정보가 표시됩니다.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
              <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.95),rgba(2,6,23,0.95))] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                      <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-400">
                        Selected Container
                      </p>
                    </div>

                    <div>
                      <p className="truncate text-2xl font-semibold tracking-tight text-slate-50">
                        {selectedContainer.name}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-400">
                        {selectedContainer.image}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={selectedContainer.status} />
                </div>
              </div>

              <div className="grid gap-3 p-4 md:grid-cols-3">
                <InfoChip label="Container ID" value={String(containerId)} />
                <InfoChip label="Image" value={selectedContainer.image} truncate />
                <InfoChip
                  label="Status"
                  value={selectedContainer.status ?? "unknown"}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ConnectionCard
                label="Metrics WS"
                endpoint="/container/ws/metrics/{container_id}"
                status={metricsStatus}
                source={metricsSource}
              />
              <ConnectionCard
                label="Logs WS"
                endpoint="/container/ws/logs/{container_id}"
                status={logsStatus}
                source={logsSource}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ConnectionCard({ label, endpoint, status, source }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <MonitoringSourceBadge source={source} />
          <MonitoringConnectionBadge status={status} />
        </div>
      </div>

      <p className="mt-3 font-mono text-sm text-slate-300">{endpoint}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        WebSocket 우선 연결 구조를 사용하며, 연결 실패 시 mock fallback으로
        동작합니다.
      </p>
    </div>
  )
}

function getOverallStatus(metricsStatus, logsStatus) {
  if (metricsStatus === "error" || logsStatus === "error") {
    return "error"
  }

  if (metricsStatus === "fallback" || logsStatus === "fallback") {
    return "fallback"
  }

  if (metricsStatus === "connecting" || logsStatus === "connecting") {
    return "connecting"
  }

  if (metricsStatus === "connected" && logsStatus === "connected") {
    return "connected"
  }

  return "idle"
}