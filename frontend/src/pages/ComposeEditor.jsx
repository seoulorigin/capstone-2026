// Compose Editor 메인 페이지 (옵션 + YAML Editor 화면 구성)

import { useState } from "react"
import MainLayout from "@/layouts/MainLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Editor from "@monaco-editor/react"

export default function ComposeEditor() {
  // YAML 상태 (초기 샘플)
  const [yamlText, setYamlText] = useState(`services:
  app:
    image: nginx:latest`)

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* 페이지 타이틀 */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Compose Editor
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Docker Compose YAML을 옵션 또는 코드로 작성합니다.
          </p>
        </div>

        {/* 변환 버튼 영역 */}
        <div className="flex gap-3">
          <Button variant="outline">옵션 → YAML</Button>
          <Button variant="outline">YAML → 옵션</Button>
        </div>

        {/* 메인 영역 (좌우 분할) */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* 옵션 영역 */}
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-medium text-slate-200">
              Options
            </h2>

            <div className="text-sm text-slate-500">
              옵션 UI는 다음 단계에서 구현
            </div>
          </Card>

          {/* YAML Editor 영역 */}
          <Card className="p-0">
            <div className="border-b border-slate-800 px-4 py-3">
              <h2 className="text-lg font-medium text-slate-200">
                YAML Editor
              </h2>
            </div>

            <div className="h-[500px]">
              <Editor
                height="100%"
                defaultLanguage="yaml"
                value={yamlText}
                onChange={(value) => setYamlText(value || "")}
                theme="vs-dark"
              />
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}