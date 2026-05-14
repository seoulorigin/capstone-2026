import { Button } from "@/components/ui/button"
import ToolbarChip from "@/components/dashboard/ToolbarChip"

export default function MonitoringLogToolbar({
  selectedContainer,
  activeStream,
  onChangeStream,
  isPaused,
  onTogglePause,
  onClearLogs,
}) {
  return (
    <>
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
          <Button
            type="button"
            variant="outline"
            onClick={onTogglePause}
            className="h-8 border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50"
          >
            {isPaused ? "재개" : "일시정지"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClearLogs}
            className="h-8 border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50"
          >
            지우기
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-3">
        <button type="button" onClick={() => onChangeStream("all")}>
          <ToolbarChip label="all" active={activeStream === "all"} />
        </button>

        <button type="button" onClick={() => onChangeStream("stdout")}>
          <ToolbarChip label="stdout" active={activeStream === "stdout"} />
        </button>

        <button type="button" onClick={() => onChangeStream("stderr")}>
          <ToolbarChip label="stderr" active={activeStream === "stderr"} />
        </button>

        <ToolbarChip label="자동 스크롤" active={!isPaused} />
        <ToolbarChip label="auto fallback" active />
      </div>
    </>
  )
}