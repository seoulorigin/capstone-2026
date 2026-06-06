// Compose Editor의 에러 및 성공 메시지를 렌더링합니다.
export default function ComposeFeedbackMessage({
  errorMessage,
  successMessage,
}) {
  if (!errorMessage && !successMessage) {
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

      {successMessage && (
        <p className="text-sm text-cyan-300">{successMessage}</p>
      )}
    </div>
  )
}