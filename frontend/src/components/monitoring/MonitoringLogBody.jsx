import { forwardRef } from "react"
import MonitoringLogLine from "@/components/monitoring/MonitoringLogLine"

const MonitoringLogBody = forwardRef(function MonitoringLogBody({ logs }, ref) {
  return (
    <div
      ref={ref}
      className="max-h-[380px] min-h-[280px] space-y-2 overflow-y-auto bg-[#020617] p-4 font-mono text-sm"
    >
      {logs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-500">
          표시할 로그가 없습니다.
        </div>
      ) : (
        logs.map((log, index) => (
          <MonitoringLogLine
            key={`${log.time}-${log.stream}-${index}`}
            time={log.time}
            stream={log.stream}
            message={log.message}
          />
        ))
      )}
    </div>
  )
})

export default MonitoringLogBody