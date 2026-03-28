import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/useProjects"

// 선택된 프로젝트에 따라 표시할 컨테이너 목록 mock 데이터
const mockContainersByProject = {
  1: [
    {
      id: "1-1",
      name: "nginx",
      image: "nginx:latest",
      status: "running",
    },
  ],
  2: [
    {
      id: "2-1",
      name: "nginx",
      image: "nginx:latest",
      status: "running",
    },
    {
      id: "2-2",
      name: "postgres",
      image: "postgres:15",
      status: "stopped",
    },
  ],
  3: [
    {
      id: "3-1",
      name: "nginx",
      image: "nginx:latest",
      status: "running",
    },
    {
      id: "3-2",
      name: "postgres",
      image: "postgres:15",
      status: "running",
    },
    {
      id: "3-3",
      name: "redis",
      image: "redis:7",
      status: "running",
    },
  ],
}

// API에서 받은 created_at 값을 화면용 날짜 문자열로 변환
function formatCreatedAt(createdAt) {
  if (!createdAt) return "-"

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return createdAt
  }

  return date.toLocaleDateString("ko-KR")
}

export default function Dashboard() {
  // 현재 선택된 프로젝트와 상세 탭 상태를 관리
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [activeTab, setActiveTab] = useState("metrics")

  // 프로젝트 목록 조회 상태를 TanStack Query로 관리
  const { data, isLoading, isError, error } = useProjects()

  // API 응답에서 프로젝트 배열만 추출
  const projects = data?.projects ?? []

  // 프로젝트 목록이 로드되면 첫 프로젝트를 기본 선택
  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id)
    }
  }, [projects, selectedProjectId])

  // 선택된 프로젝트 id에 해당하는 프로젝트 정보를 계산
  const selectedProject = useMemo(() => {
    return projects.find((project) => project.id === selectedProjectId) ?? null
  }, [projects, selectedProjectId])

  // 선택된 프로젝트에 맞는 컨테이너 목록을 표시
  const containers =
    selectedProjectId !== null ? mockContainersByProject[selectedProjectId] || [] : []

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            프로젝트를 선택하고, 해당 프로젝트의 컨테이너 상태와 메트릭/로그
            정보를 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>프로젝트 목록</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                    프로젝트 목록을 불러오는 중입니다.
                  </div>
                ) : isError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error?.message ?? "프로젝트 목록을 불러오지 못했습니다."}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                    등록된 프로젝트가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projects.map((project) => {
                      const isSelected = selectedProjectId === project.id

                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => setSelectedProjectId(project.id)}
                          className={`w-full rounded-lg border p-4 text-left transition ${
                            isSelected
                              ? "border-slate-900 bg-slate-100 ring-1 ring-slate-900"
                              : "bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-medium text-slate-900">
                              {project.name}
                            </p>
                            <span className="shrink-0 text-xs text-slate-500">
                              {formatCreatedAt(project.created_at)}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-600">
                            {project.description ?? "설명이 없는 프로젝트입니다."}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="lg:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>컨테이너 목록 및 상태</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {selectedProject ? (
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm font-medium text-slate-900">
                      선택된 프로젝트: {selectedProject.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {selectedProject.description ??
                        "설명이 없는 프로젝트입니다."}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                    먼저 프로젝트를 선택해주세요.
                  </div>
                )}

                <div className="overflow-hidden rounded-lg border bg-white">
                  <div className="grid grid-cols-3 border-b bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                    <span>이름</span>
                    <span>이미지</span>
                    <span>상태</span>
                  </div>

                  {containers.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      표시할 컨테이너가 없습니다.
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {containers.map((container) => (
                        <li
                          key={container.id}
                          className="grid grid-cols-3 items-center px-4 py-3 text-sm"
                        >
                          <span className="font-medium text-slate-900">
                            {container.name}
                          </span>
                          <span className="text-slate-600">{container.image}</span>
                          <span
                            className={
                              container.status === "running"
                                ? "font-medium text-green-600"
                                : "font-medium text-red-500"
                            }
                          >
                            {container.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section>
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>상세 정보</CardTitle>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={activeTab === "metrics" ? "default" : "outline"}
                  onClick={() => setActiveTab("metrics")}
                >
                  메트릭
                </Button>
                <Button
                  type="button"
                  variant={activeTab === "logs" ? "default" : "outline"}
                  onClick={() => setActiveTab("logs")}
                >
                  로그
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {activeTab === "metrics" ? (
                <div className="space-y-3">
                  <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                    추후 CPU / Memory 실시간 차트와 메트릭 히스토리 UI가
                    들어갈 영역입니다.
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border bg-white p-4">
                      <p className="text-sm font-medium text-slate-700">CPU 사용량</p>
                      <div className="mt-3 h-24 rounded-md bg-slate-100" />
                    </div>
                    <div className="rounded-lg border bg-white p-4">
                      <p className="text-sm font-medium text-slate-700">
                        메모리 사용량
                      </p>
                      <div className="mt-3 h-24 rounded-md bg-slate-100" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                    추후 실시간 로그 스트리밍 및 로그 검색 UI가 들어갈
                    영역입니다.
                  </div>

                  <div className="rounded-lg border bg-slate-950 p-4 text-sm text-slate-200">
                    <p>[12:00:01] nginx container started</p>
                    <p>[12:00:03] postgres connection established</p>
                    <p>[12:00:05] redis ready to accept connections</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}