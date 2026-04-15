import MetricInfoCard from "@/components/dashboard/MetricInfoCard"
import ToolbarChip from "@/components/dashboard/ToolbarChip"
import LogLine from "@/components/dashboard/LogLine"
import { CONTAINER_LOG_PREVIEW } from "@/mocks/data/containerLogs"

// 선택된 컨테이너의 로그 preview를 표시하는 패널 (mock 기반)
export default function LogsPreviewPanel({ selectedContainer }) {
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

      <div className="grid gap-4 md:grid-cols-3">
        <MetricInfoCard label="Log Source" value="Container stdout" />
        <MetricInfoCard label="Current Mode" value="Preview" />
        <MetricInfoCard label="Streaming" value="Pending" />
      </div>
    </div>
  )
}