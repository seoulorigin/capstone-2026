// src/pages/ComposeEditor.jsx
// Compose Editor 페이지의 상태, YAML 생성, 배포 흐름을 관리합니다.
import { useState } from "react"

import MainLayout from "@/layouts/MainLayout"
import { deployComposeYaml } from "@/api/containerApi"
import ComposeOptionForm from "@/features/compose/components/ComposeOptionForm"
import ComposeEditorHeader from "@/features/compose/components/ComposeEditorHeader"
import ComposeEditorToolbar from "@/features/compose/components/ComposeEditorToolbar"
import ComposeFeedbackMessage from "@/features/compose/components/ComposeFeedbackMessage"
import ComposeSyncControl from "@/features/compose/components/ComposeSyncControl"
import ComposeYamlEditorPanel from "@/features/compose/components/ComposeYamlEditorPanel"
import { Card } from "@/components/ui/card"
import {
  convertOptionsToYaml,
  validateYamlSyntax,
} from "@/features/compose/utils/composeYaml"

const initialComposeOptions = {
  serviceName: "app",
  image: "nginx:latest",
  containerName: "my-container",
  ports: [
    {
      hostPort: "8080",
      containerPort: "80",
    },
  ],
  environment: [
    {
      key: "NODE_ENV",
      value: "production",
    },
  ],
}

const initialYamlText = convertOptionsToYaml(initialComposeOptions)

function getErrorMessage(error) {
  return (
    error?.response?.data?.detail?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Compose 배포 중 오류가 발생했습니다."
  )
}

export default function ComposeEditor() {
  const [composeOptions, setComposeOptions] = useState(initialComposeOptions)
  const [yamlText, setYamlText] = useState(initialYamlText)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)

  const resetMessages = () => {
    setErrorMessage("")
    setSuccessMessage("")
  }

  const handleComposeOptionsChange = (nextOptions) => {
    setComposeOptions(nextOptions)
    resetMessages()
  }

  const handleYamlTextChange = (value) => {
    setYamlText(value || "")
    resetMessages()
  }

  const handleGenerateYaml = () => {
    try {
      const nextYaml = convertOptionsToYaml(composeOptions)

      setYamlText(nextYaml)
      resetMessages()
    } catch {
      setErrorMessage("Options 값을 YAML로 변환하는 중 오류가 발생했습니다.")
      setSuccessMessage("")
    }
  }

  const handleDeployCompose = async () => {
    try {
      setIsDeploying(true)
      resetMessages()

      validateYamlSyntax(yamlText)

      const result = await deployComposeYaml(yamlText)

      setSuccessMessage(
        result?.message || "Compose 배포 요청이 정상적으로 전송되었습니다.",
      )
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <ComposeEditorHeader />

        <ComposeEditorToolbar
          isDeploying={isDeploying}
          onDeployCompose={handleDeployCompose}
        />

        <ComposeFeedbackMessage
          errorMessage={errorMessage}
          successMessage={successMessage}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <Card className="border-slate-800 bg-slate-950/70 p-5">
            <div className="mb-5">
              <h2 className="text-lg font-medium text-slate-200">Options</h2>
              <p className="mt-1 text-sm text-slate-500">
                Options 입력값을 기준으로 Docker Compose YAML을 생성합니다.
              </p>
            </div>

            <ComposeOptionForm
              options={composeOptions}
              onChange={handleComposeOptionsChange}
            />
          </Card>

          <ComposeSyncControl onGenerateYaml={handleGenerateYaml} />

          <ComposeYamlEditorPanel
            yamlText={yamlText}
            onChange={handleYamlTextChange}
          />
        </div>
      </div>
    </MainLayout>
  )
}