// Compose Editor 페이지의 제목과 설명을 렌더링합니다.
export default function ComposeEditorHeader() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-100">
        Compose Editor
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Docker Compose YAML을 옵션 또는 코드로 작성하고 배포합니다.
      </p>
    </div>
  )
}