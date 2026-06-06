import { useEffect, useMemo, useRef, useState } from "react"
import MetricInfoCard from "@/components/dashboard/MetricInfoCard"
import ToolbarChip from "@/components/dashboard/ToolbarChip"
import LogLine from "@/components/dashboard/LogLine"
import MonitoringConnectionBadge from "@/components/monitoring/MonitoringConnectionBadge"
import MonitoringSourceBadge from "@/components/monitoring/MonitoringSourceBadge"

// 선택된 컨테이너의 WebSocket 로그 preview를 표시하는 패널
export default function LogsPreviewPanel({ selectedContainer, logsResult }) {
  const [activeStream, setActiveStream] = useState("all")
  const terminalRef = useRef(null)

  const {
    logs = [],
    isPaused = false,
    clearLogs = () => {},
    togglePause = () => {},
    source = "mock-fallback",
    connectionStatus = "idle",
    realConnectionStatus = null,
  } = logsResult ?? {}

  const filteredLogs = useMemo(() => {
    if (activeStream === "all") return logs
    return logs.filter((log) => log.stream === activeStream)
  }, [logs, activeStream])

  useEffect(() => {
    if (!terminalRef.current || isPaused) return

    terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [filteredLogs, isPaused])

  useEffect(() => {
    setActiveStream("all")
  }, [selectedContainer])

  return (
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
              <p className="text-sm font-medium text-slate-100">로그 스트림</p>
              <p className="text-xs text-slate-500">
                {selectedContainer.name} · {selectedContainer.image}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <MonitoringSourceBadge source={source} />
            <MonitoringConnectionBadge status={connectionStatus} />

            <span
              className={`rounded-full border px-3 py-1 text-xs ${
                isPaused
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {isPaused ? "paused" : "streaming"}
            </span>

            <button
              type="button"
              onClick={togglePause}
              className="h-8 rounded-md border border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50"
            >
              {isPaused ? "재개" : "일시정지"}
            </button>

            <button
              type="button"
              onClick={clearLogs}
              className="h-8 rounded-md border border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50"
            >
              지우기
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-3">
          <button type="button" onClick={() => setActiveStream("all")}>
            <ToolbarChip label="all" active={activeStream === "all"} />
          </button>

          <button type="button" onClick={() => setActiveStream("stdout")}>
            <ToolbarChip label="stdout" active={activeStream === "stdout"} />
          </button>

          <button type="button" onClick={() => setActiveStream("stderr")}>
            <ToolbarChip label="stderr" active={activeStream === "stderr"} />
          </button>

          <ToolbarChip label="자동 스크롤" active={!isPaused} />
          <ToolbarChip label="WebSocket" active={source === "real"} />
        </div>

        <div
          ref={terminalRef}
          className="max-h-[360px] min-h-[280px] space-y-2 overflow-y-auto bg-[#020617] p-4 font-mono text-sm"
        >
          {filteredLogs.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-500">
              표시할 로그가 없습니다.
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <LogLine
                key={`${log.time}-${log.stream}-${index}`}
                time={log.time}
                stream={log.stream}
                message={log.message}
              />
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricInfoCard label="Log Source" value={getSourceLabel(source)} />
        <MetricInfoCard label="WS Status" value={connectionStatus ?? "idle"} />
        <MetricInfoCard label="Logs" value={`${logs.length} lines`} />
      </div>

      {source === "mock-fallback" && realConnectionStatus ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
          실제 WebSocket 상태는 {realConnectionStatus}이며, 현재 mock fallback
          로그를 표시하고 있습니다.
        </div>
      ) : null}
    </div>
  )
}

function getSourceLabel(source) {
  if (source === "real") return "REAL WS"
  if (source === "mock-fallback") return "MOCK FALLBACK"
  if (source === "mock") return "MOCK"
  return String(source ?? "unknown")
}