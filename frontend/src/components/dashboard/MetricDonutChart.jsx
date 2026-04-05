import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts"

// 사용량 퍼센트를 도넛 형태로 표시하는 재사용 차트 컴포넌트
export default function MetricDonutChart({
  title,
  percent,
  primaryText,
  secondaryText,
  color = "#2563eb",
}) {
  const safePercent = Number.isFinite(percent)
    ? Math.max(0, Math.min(100, Number(percent.toFixed(1))))
    : 0

  const chartData = [
    { name: "used", value: safePercent },
    { name: "rest", value: 100 - safePercent },
  ]

  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm font-medium text-slate-700">{title}</p>

      <div className="mt-4 flex flex-col items-center gap-3">
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
                <Cell fill={color} />
                <Cell fill="#e2e8f0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">
              {safePercent.toFixed(1)}%
            </span>
            <span className="mt-1 text-xs text-slate-500">사용량</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-slate-900">{primaryText}</p>
          {secondaryText ? (
            <p className="mt-1 text-xs text-slate-500">{secondaryText}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}