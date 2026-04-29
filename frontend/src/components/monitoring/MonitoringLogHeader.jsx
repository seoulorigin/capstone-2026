import { CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MonitoringSourceBadge from "@/components/monitoring/MonitoringSourceBadge"
import MonitoringConnectionBadge from "@/components/monitoring/MonitoringConnectionBadge"

export default function MonitoringLogHeader({
  source,
  connectionStatus,
  isPaused,
  selectedContainer,
  onReconnect,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
          실시간 로그 터미널
        </CardTitle>
        <p className="mt-2 text-sm text-slate-400">
          WebSocket 연결 성공 시 real 로그를 사용하고, 연결 전에는 mock
          fallback 로그를 표시합니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <MonitoringSourceBadge source={source} />
        <MonitoringConnectionBadge status={connectionStatus} />

        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs ${
            isPaused
              ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {isPaused ? "paused" : "streaming"}
        </span>

        <Button
          type="button"
          variant="outline"
          onClick={onReconnect}
          disabled={!selectedContainer || connectionStatus === "connecting"}
          className="h-8 border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50 disabled:opacity-50"
        >
          {connectionStatus === "connecting" ? "연결 중" : "WS 재연결"}
        </Button>
      </div>
    </div>
  )
}