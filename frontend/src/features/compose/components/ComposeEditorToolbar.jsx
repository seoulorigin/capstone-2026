// Compose 실행 버튼과 배포 진행 상태를 렌더링합니다.
import { Button } from "@/components/ui/button"

export default function ComposeEditorToolbar({
  isDeploying,
  onDeployCompose,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={onDeployCompose} disabled={isDeploying}>
        {isDeploying ? "배포 요청 중..." : "Compose 실행"}
      </Button>

      {isDeploying && (
        <p className="text-sm text-slate-400">
          백엔드로 Compose YAML을 전송하고 있습니다.
        </p>
      )}
    </div>
  )
}