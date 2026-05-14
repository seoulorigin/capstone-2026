export default function MonitoringSourceBadge({ source }) {
  const className =
    source === "real"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : source === "mock-fallback"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
      : "border-slate-700 bg-slate-950 text-slate-400"

  const label =
    source === "real"
      ? "REAL WS"
      : source === "mock-fallback"
      ? "MOCK FALLBACK"
      : "MOCK"

  return (
    <span className={`w-fit rounded-full border px-3 py-1 text-xs ${className}`}>
      {label}
    </span>
  )
}