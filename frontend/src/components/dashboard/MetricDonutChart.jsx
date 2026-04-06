import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

// 사용량 퍼센트를 도넛 형태로 표시하는 재사용 차트 컴포넌트
export default function MetricDonutChart({
  title,
  percent,
  primaryText,
  secondaryText,
  color,
}) {
  const safePercent = Number.isFinite(percent)
    ? Math.max(0, Math.min(100, Number(percent.toFixed(1))))
    : 0

  const { statusLabel, accentColor, glowClass, panelToneClass } =
    getMetricTone(safePercent, color)

  const chartData = [
    { name: "used", value: safePercent },
    { name: "rest", value: 100 - safePercent },
  ]

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${panelToneClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Metric
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-100">{title}</p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${glowClass}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="relative h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={62}
                outerRadius={86}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive
              >
                <Cell fill={accentColor} />
                <Cell fill="#1e293b" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-slate-50">
              {safePercent.toFixed(1)}%
            </span>
            <span className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              usage
            </span>
          </div>
        </div>

        <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-sm font-medium text-slate-100">{primaryText}</p>
          {secondaryText ? (
            <p className="mt-1 text-xs text-slate-500">{secondaryText}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function getMetricTone(percent, preferredColor) {
  if (preferredColor) {
    return {
      statusLabel: percent >= 80 ? "High" : percent >= 50 ? "Active" : "Normal",
      accentColor: preferredColor,
      glowClass:
        percent >= 80
          ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
          : percent >= 50
          ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      panelToneClass:
        "border-slate-800 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  if (percent >= 80) {
    return {
      statusLabel: "High",
      accentColor: "#f43f5e",
      glowClass: "border-rose-500/20 bg-rose-500/10 text-rose-300",
      panelToneClass:
        "border-rose-500/10 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.12),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  if (percent >= 50) {
    return {
      statusLabel: "Active",
      accentColor: "#f59e0b",
      glowClass: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      panelToneClass:
        "border-amber-500/10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
    }
  }

  return {
    statusLabel: "Normal",
    accentColor: "#22c55e",
    glowClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    panelToneClass:
      "border-emerald-500/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.10),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]",
  }
}