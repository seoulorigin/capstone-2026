// 로그 필터/옵션 표시용 칩 UI 컴포넌트
export default function ToolbarChip({ label, active = false }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs ${
        active
          ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
          : "border-slate-700 bg-slate-900 text-slate-400"
      }`}
    >
      {label}
    </span>
  )
}