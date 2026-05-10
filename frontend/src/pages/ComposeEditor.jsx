// src/pages/ComposeEditor.jsx

import { useState } from "react"
import Editor from "@monaco-editor/react"

import MainLayout from "@/layouts/MainLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { deployComposeYaml } from "@/api/containerApi"
import ComposeOptionForm from "@/features/compose/components/ComposeOptionForm"
import {
  convertOptionsToYaml,
  convertYamlToOptions,
} from "@/features/compose/utils/composeYaml"

// Compose Editor 옵션 UI의 초기 입력값을 정의합니다.
const initialComposeOptions = {
  serviceName: "app",
  image: "nginx:latest",
  containerName: "my-container",
  hostPort: "8080",
  containerPort: "80",
  environmentKey: "NODE_ENV",
  environmentValue: "production",
}

// YAML Editor의 초기 compose YAML 문자열을 정의합니다.
const initialYamlText = `services:
  app:
    image: nginx:latest`

// axios 또는 일반 Error 객체에서 화면에 표시할 에러 메시지를 추출합니다.
function getErrorMessage(error) {
  return (
    error?.response?.data?.detail?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Compose 배포 중 오류가 발생했습니다."
  )
}

export default function ComposeEditor() {
  // 옵션 UI에서 관리하는 compose 입력 상태입니다.
  const [composeOptions, setComposeOptions] = useState(initialComposeOptions)

  // Monaco Editor에서 관리하는 YAML 문자열 상태입니다.
  const [yamlText, setYamlText] = useState(initialYamlText)

  // YAML 검증 또는 API 실패 메시지를 저장합니다.
  const [errorMessage, setErrorMessage] = useState("")

  // Compose 배포 성공 메시지를 저장합니다.
  const [successMessage, setSuccessMessage] = useState("")

  // Compose 배포 요청 중복 실행을 막기 위한 loading 상태입니다.
  const [isDeploying, setIsDeploying] = useState(false)

  // 옵션 UI 값을 YAML 문자열로 변환합니다.
  const handleOptionsToYaml = () => {
    const nextYaml = convertOptionsToYaml(composeOptions)

    setYamlText(nextYaml)
    setErrorMessage("")
    setSuccessMessage("")
  }

  // YAML 문자열을 옵션 UI 값으로 변환합니다.
  const handleYamlToOptions = () => {
    try {
      const nextOptions = convertYamlToOptions(yamlText)

      setComposeOptions(nextOptions)
      setErrorMessage("")
      setSuccessMessage("")
    } catch {
      setErrorMessage("YAML 문법 또는 지원하지 않는 Compose 구조입니다.")
      setSuccessMessage("")
    }
  }

  // 현재 YAML을 검증한 뒤 백엔드 compose up API로 배포 요청을 보냅니다.
  const handleDeployCompose = async () => {
    try {
      setIsDeploying(true)
      setErrorMessage("")
      setSuccessMessage("")

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
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Compose Editor
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Docker Compose YAML을 옵션 또는 코드로 작성하고 배포합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleOptionsToYaml}>
            옵션 → YAML
          </Button>

          <Button variant="outline" onClick={handleYamlToOptions}>
            YAML → 옵션
          </Button>

          <Button onClick={handleDeployCompose} disabled={isDeploying}>
            {isDeploying ? "배포 요청 중..." : "Compose 실행"}
          </Button>

          {isDeploying && (
            <p className="text-sm text-slate-400">
              백엔드로 Compose YAML을 전송하고 있습니다.
            </p>
          )}
        </div>

        {(errorMessage || successMessage) && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            {errorMessage && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}

            {successMessage && (
              <p className="text-sm text-cyan-300">{successMessage}</p>
            )}
          </div>
        )}

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
                onChange={(value) => {
                  setYamlText(value || "")
                  setErrorMessage("")
                  setSuccessMessage("")
                }}
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