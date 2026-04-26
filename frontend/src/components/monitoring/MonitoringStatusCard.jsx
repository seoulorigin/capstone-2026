import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatusBadge from "@/components/dashboard/StatusBadge"
import InfoChip from "@/components/dashboard/InfoChip"

export default function MonitoringStatusCard({ selectedContainer }) {
  const containerId =
    selectedContainer?.container_id ?? selectedContainer?.id ?? "-"

  return (
    <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
              선택 컨테이너 정보
            </CardTitle>
            <p className="mt-2 text-sm text-slate-400">
              현재 선택된 컨테이너와 WebSocket 연결 준비 상태를 표시합니다.
            </p>
          </div>

          <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            mock connected
          </span>
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
                endpoint="/ws/metrics/{container_id}"
                status="Ready"
              />
              <ConnectionCard
                label="Logs WS"
                endpoint="/ws/logs/{container_id}"
                status="Ready"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ConnectionCard({ label, endpoint, status }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>

        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
          {status}
        </span>
      </div>

      <p className="mt-3 font-mono text-sm text-slate-300">{endpoint}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        현재는 mock UI 상태이며, 추후 WebSocket hook으로 교체할 수 있도록
        영역을 분리했습니다.
      </p>
    </div>
  )
}