export default function MonitoringConnectionBadge({ status }) {
  const className =
    status === "connected"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : status === "connecting"
      ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
      : status === "fallback"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
      : status === "error"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
      : "border-slate-700 bg-slate-950 text-slate-400"

  return (
    <span className={`w-fit rounded-full border px-3 py-1 text-xs ${className}`}>
      {status ?? "idle"}
    </span>
  )
}