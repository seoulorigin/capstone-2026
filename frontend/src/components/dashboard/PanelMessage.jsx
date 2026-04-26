// 상태 메시지 (기본 / 에러)를 표시하는 공통 UI 컴포넌트
export default function PanelMessage({ message, variant = "default" }) {
  const className =
    variant === "error"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
      : "border-slate-800 bg-slate-950/70 text-slate-400"

  return (
    <div className={`rounded-2xl border p-4 text-sm ${className}`}>{message}</div>
  )
}