import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ToolbarChip from "@/components/dashboard/ToolbarChip"
import { useContainerLogs } from "@/hooks/useContainerLogs"

export default function MonitoringLogTerminal({ selectedContainer }) {
  const [activeStream, setActiveStream] = useState("all")
  const terminalRef = useRef(null)

  const { logs, isPaused, clearLogs, togglePause } =
    useContainerLogs(selectedContainer)

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
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
              실시간 로그 터미널
            </CardTitle>
            <p className="mt-2 text-sm text-slate-400">
              선택한 컨테이너의 stdout / stderr 로그를 터미널 형태로 표시합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
              mock stream
            </span>

            <span
              className={`w-fit rounded-full border px-3 py-1 text-xs ${
                isPaused
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {isPaused ? "paused" : "connected"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!selectedContainer ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
            컨테이너를 선택하면 로그 터미널이 표시됩니다.
          </div>
        ) : (
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={togglePause}
                  className="h-8 border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50"
                >
                  {isPaused ? "재개" : "일시정지"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={clearLogs}
                  className="h-8 border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50"
                >
                  지우기
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-3">
              <button type="button" onClick={() => setActiveStream("all")}>
                <ToolbarChip label="all" active={activeStream === "all"} />
              </button>

              <button type="button" onClick={() => setActiveStream("stdout")}>
                <ToolbarChip
                  label="stdout"
                  active={activeStream === "stdout"}
                />
              </button>

              <button type="button" onClick={() => setActiveStream("stderr")}>
                <ToolbarChip
                  label="stderr"
                  active={activeStream === "stderr"}
                />
              </button>

              <ToolbarChip label="자동 스크롤" active={!isPaused} />
              <ToolbarChip label="WS 예정" />
            </div>

            <div
              ref={terminalRef}
              className="max-h-[380px] min-h-[280px] space-y-2 overflow-y-auto bg-[#020617] p-4 font-mono text-sm"
            >
              {filteredLogs.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-500">
                  표시할 로그가 없습니다.
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <MonitoringLogLine
                    key={`${log.time}-${log.stream}-${index}`}
                    time={log.time}
                    stream={log.stream}
                    message={log.message}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MonitoringLogLine({ time, stream, message }) {
  const streamClassName =
    stream === "stderr" ? "text-rose-300" : "text-cyan-300"

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
      <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-3">
        <span className="shrink-0 text-xs text-slate-500">{time}</span>

        <span className={`shrink-0 text-xs font-semibold ${streamClassName}`}>
          {stream}
        </span>

        <p className="min-w-0 text-sm text-slate-300">{message}</p>
      </div>
    </div>
  )
}