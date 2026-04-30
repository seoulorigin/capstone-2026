import { useState } from "react"
import Editor from "@monaco-editor/react"

import MainLayout from "@/layouts/MainLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ComposeOptionForm from "@/features/compose/components/ComposeOptionForm"

const initialComposeOptions = {
  serviceName: "app",
  image: "nginx:latest",
  containerName: "my-container",
  hostPort: "8080",
  containerPort: "80",
  environmentKey: "NODE_ENV",
  environmentValue: "production",
}

export default function ComposeEditor() {
  const [composeOptions, setComposeOptions] = useState(initialComposeOptions)
  const [yamlText, setYamlText] = useState(`services:
  app:
    image: nginx:latest`)

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Compose Editor
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Docker Compose YAML을 옵션 또는 코드로 작성합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline">옵션 → YAML</Button>
          <Button variant="outline">YAML → 옵션</Button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="border-slate-800 bg-slate-950/70 p-5">
            <div className="mb-5">
              <h2 className="text-lg font-medium text-slate-200">Options</h2>
              <p className="mt-1 text-sm text-slate-500">
                MVP 단계에서는 단일 service 기준 필드만 지원합니다.
              </p>
            </div>

            <ComposeOptionForm
              options={composeOptions}
              onChange={setComposeOptions}
            />
          </Card>

          <Card className="overflow-hidden border-slate-800 bg-slate-950/70 p-0">
            <div className="border-b border-slate-800 px-4 py-3">
              <h2 className="text-lg font-medium text-slate-200">
                YAML Editor
              </h2>
            </div>

            <div className="h-[560px]">
              <Editor
                height="100%"
                defaultLanguage="yaml"
                value={yamlText}
                onChange={(value) => setYamlText(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  tabSize: 2,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}