import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ToolbarChip from "@/components/dashboard/ToolbarChip"
import LogLine from "@/components/dashboard/LogLine"
import { CONTAINER_LOG_PREVIEW } from "@/mocks/data/containerLogs"

export default function MonitoringLogTerminal({ selectedContainer }) {
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

          <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
            mock logs
          </span>
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
                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                  preview
                </span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  connected
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-3">
              <ToolbarChip label="stdout" active />
              <ToolbarChip label="stderr" />
              <ToolbarChip label="자동 스크롤" active />
              <ToolbarChip label="필터 예정" />
            </div>

            <div className="max-h-[360px] space-y-2 overflow-y-auto bg-[#020617] p-4 font-mono text-sm">
              {CONTAINER_LOG_PREVIEW.map((log, index) => (
                <LogLine
                  key={`${log.time}-${log.level}-${index}`}
                  time={log.time}
                  level={log.level}
                  message={log.message}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}