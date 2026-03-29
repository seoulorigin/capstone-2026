// 컨테이너 상태값에 따라 색상을 다르게 표시하는 컴포넌트

export default function StatusBadge({ status }) {
  const statusClassName =
    status === "running"
      ? "font-medium text-green-600"
      : status === "restarting"
      ? "font-medium text-yellow-600"
      : "font-medium text-red-500"

  return <span className={statusClassName}>{status}</span>
}