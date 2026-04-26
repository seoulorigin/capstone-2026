// 간단한 key-value 정보를 표시하는 칩 형태 UI 컴포넌트
export default function InfoChip({ label, value, truncate = false }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-sm font-medium text-slate-200 ${
          truncate ? "truncate" : ""
        }`}
      >
        {value}
      </p>
    </div>
  )
}