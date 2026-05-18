// Monaco 기반 YAML Editor 패널을 렌더링합니다.
import Editor from "@monaco-editor/react"

import { Card } from "@/components/ui/card"

export default function ComposeYamlEditorPanel({ yamlText, onChange }) {
  return (
    <Card className="overflow-hidden border-slate-800 bg-slate-950/70 p-0">
      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-lg font-medium text-slate-200">YAML Editor</h2>
      </div>

      <div className="h-[560px]">
        <Editor
          height="100%"
          defaultLanguage="yaml"
          value={yamlText}
          onChange={onChange}
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
  )
}