// Options 입력값을 YAML Editor에 반영하는 생성 버튼을 렌더링합니다.
import { FileCode2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ComposeSyncControl({ onGenerateYaml }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 p-3 xl:w-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onGenerateYaml}
          className="w-full border-slate-700 bg-slate-950 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-slate-50 xl:w-auto"
        >
          <FileCode2 className="mr-2 size-5" />
          YAML 생성
        </Button>
      </div>
    </div>
  )
}