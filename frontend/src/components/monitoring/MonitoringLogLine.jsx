export default function MonitoringLogLine({ time, stream, message }) {
  const streamClassName =
    stream === "stderr" ? "text-rose-300" : "text-cyan-300"

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
      <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-3">
        <span className="shrink-0 text-xs text-slate-500">{time}</span>

        <span className={`shrink-0 text-xs font-semibold ${streamClassName}`}>
          {stream}
        </span>

        <p className="min-w-0 text-sm text-slate-300">{message}</p>
      </div>
    </div>
  )
}