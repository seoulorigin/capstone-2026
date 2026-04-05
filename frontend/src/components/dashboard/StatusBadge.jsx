
// 컨테이너 상태값에 따라 다른 색상의 텍스트를 표시
export default function StatusBadge({ status }) {
  const normalizedStatus = String(status ?? "").toLowerCase()

  const statusClassName =
    normalizedStatus === "running"
      ? "font-medium text-green-600"
      : normalizedStatus === "restarting"
      ? "font-medium text-yellow-600"
      : normalizedStatus === "stopped" ||
        normalizedStatus === "exited" ||
        normalizedStatus === "paused"
      ? "font-medium text-slate-500"
      : "font-medium text-red-500"

  return <span className={statusClassName}>{status ?? "unknown"}</span>
}