import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import MonitoringLogHeader from "@/components/monitoring/MonitoringLogHeader"
import MonitoringLogToolbar from "@/components/monitoring/MonitoringLogToolbar"
import MonitoringLogBody from "@/components/monitoring/MonitoringLogBody"

export default function MonitoringLogTerminal({
  selectedContainer,
  logsResult,
}) {
  const [activeStream, setActiveStream] = useState("all")
  const terminalRef = useRef(null)

  const {
    logs = [],
    isPaused = false,
    clearLogs = () => {},
    togglePause = () => {},
    source = "mock-fallback",
    connectionStatus = "idle",
    reconnect = () => {},
  } = logsResult ?? {}

  const filteredLogs = useMemo(() => {
    if (activeStream === "all") return logs
    return logs.filter((log) => log.stream === activeStream)
  }, [logs, activeStream])

  useEffect(() => {
    if (!terminalRef.current || isPaused) return

    terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [filteredLogs, isPaused])

  return (
    <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
      <CardHeader className="space-y-3">
        <MonitoringLogHeader
          source={source}
          connectionStatus={connectionStatus}
          isPaused={isPaused}
          selectedContainer={selectedContainer}
          onReconnect={reconnect}
        />
      </CardHeader>

      <CardContent>
        {!selectedContainer ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
            컨테이너를 선택하면 로그 터미널이 표시됩니다.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
            <MonitoringLogToolbar
              selectedContainer={selectedContainer}
              activeStream={activeStream}
              onChangeStream={setActiveStream}
              isPaused={isPaused}
              onTogglePause={togglePause}
              onClearLogs={clearLogs}
            />

            <MonitoringLogBody ref={terminalRef} logs={filteredLogs} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}