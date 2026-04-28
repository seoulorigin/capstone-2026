import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function MonitoringLineChart({
  title,
  description,
  data,
  dataKey,
  valueSuffix = "%",
  accentColor = "#22d3ee",
}) {
  const latestValue = data?.length ? data[data.length - 1]?.[dataKey] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]">
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Metric
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-100">{title}</p>
          {description ? (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          ) : null}
        </div>

        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
          {typeof latestValue === "number"
            ? `${latestValue.toFixed(1)}${valueSuffix}`
            : `--${valueSuffix}`}
        </span>
      </div>

      <div className="h-[280px] bg-slate-950/40 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`${dataKey}-gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.28} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />

            <XAxis
              dataKey="time"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={18}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              cursor={{ stroke: "#334155", strokeWidth: 1 }}
              content={<ChartTooltip dataKey={dataKey} valueSuffix={valueSuffix} />}
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="none"
              fill={`url(#${dataKey}-gradient)`}
              isAnimationActive
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={accentColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                stroke: accentColor,
                strokeWidth: 2,
                fill: "#020617",
              }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ChartTooltip({ active, payload, label, dataKey, valueSuffix }) {
  if (!active || !payload?.length) return null

  const value = payload.find((item) => item.dataKey === dataKey)?.value

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/95 px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">
        {typeof value === "number" ? value.toFixed(1) : "--"}
        {valueSuffix}
      </p>
    </div>
  )
}