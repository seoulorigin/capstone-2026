// 메트릭 값을 카드 형태로 표시하는 UI 컴포넌트
export default function MetricInfoCard({ label, value }) {
  const tone = getMetricCardTone(label)

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tone.panelToneClass}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${tone.dotClassName}`} />
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">{tone.helperText}</p>
    </div>
  )
}
// 메트릭 종류에 따라 색상 및 스타일을 결정
function getMetricCardTone(label) {
  const normalizedLabel = String(label ?? "").toLowerCase()

  if (normalizedLabel.includes("cpu")) {
    return {
      dotClassName: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]",
      helperText: "현재 CPU 사용 상태",
      panelToneClass:
        "border-cyan-500/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  if (normalizedLabel.includes("memory used")) {
    return {
      dotClassName: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]",
      helperText: "현재 메모리 사용량",
      panelToneClass:
        "border-emerald-500/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.10),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  if (normalizedLabel.includes("memory limit")) {
    return {
      dotClassName: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.45)]",
      helperText: "할당된 메모리 한도",
      panelToneClass:
        "border-slate-700 bg-[radial-gradient(circle_at_top_left,rgba(100,116,139,0.12),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  return {
    dotClassName: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.45)]",
    helperText: "현재 메트릭 정보",
    panelToneClass:
      "border-slate-700 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
  }
}