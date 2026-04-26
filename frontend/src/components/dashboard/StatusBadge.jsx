// 컨테이너 상태값에 따라 다른 색상의 배지를 표시
export default function StatusBadge({ status }) {
  const normalizedStatus = String(status ?? "").toLowerCase()

  const badgeClassName =
    normalizedStatus === "running"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : normalizedStatus === "restarting"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
      : normalizedStatus === "stopped" ||
        normalizedStatus === "exited" ||
        normalizedStatus === "paused"
      ? "border-slate-700 bg-slate-800 text-slate-300"
      : "border-rose-500/30 bg-rose-500/10 text-rose-300"

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize tracking-wide ${badgeClassName}`}
    >
      {status ?? "unknown"}
    </span>
  )
}