// src/pages/ComposeEditor.jsx
// Compose Editor 페이지의 상태, 동기화, 배포 흐름을 관리합니다.
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
  convertYamlToOptions,
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
  environmentKey: "NODE_ENV",
  environmentValue: "production",
}

const initialYamlText = `services:
  app:
    image: nginx:latest`

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
  const [lastEditedSource, setLastEditedSource] = useState("options")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)

  const syncButtonLabel =
    lastEditedSource === "options" ? "YAML에 반영" : "옵션에 반영"

  const resetMessages = () => {
    setErrorMessage("")
    setSuccessMessage("")
  }

  const handleComposeOptionsChange = (nextOptions) => {
    setComposeOptions(nextOptions)
    setLastEditedSource("options")
    resetMessages()
  }

  const handleYamlTextChange = (value) => {
    setYamlText(value || "")
    setLastEditedSource("yaml")
    resetMessages()
  }

  const handleOptionsToYaml = () => {
    const nextYaml = convertOptionsToYaml(composeOptions)

    setYamlText(nextYaml)
    resetMessages()
  }

  const handleYamlToOptions = () => {
    try {
      const nextOptions = convertYamlToOptions(yamlText)

      setComposeOptions(nextOptions)
      resetMessages()
    } catch {
      setErrorMessage("YAML 문법 또는 지원하지 않는 Compose 구조입니다.")
      setSuccessMessage("")
    }
  }

  const handleSyncCompose = () => {
    if (lastEditedSource === "options") {
      handleOptionsToYaml()
      return
    }

    handleYamlToOptions()
  }

  const handleDeployCompose = async () => {
    try {
      setIsDeploying(true)
      resetMessages()

      convertYamlToOptions(yamlText)

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
                MVP 단계에서는 단일 service 기준 필드만 지원합니다.
              </p>
            </div>

            <ComposeOptionForm
              options={composeOptions}
              onChange={handleComposeOptionsChange}
            />
          </Card>

          <ComposeSyncControl
            label={syncButtonLabel}
            onSync={handleSyncCompose}
          />

          <ComposeYamlEditorPanel
            yamlText={yamlText}
            onChange={handleYamlTextChange}
          />
        </div>
      </div>
    </MainLayout>
  )
}