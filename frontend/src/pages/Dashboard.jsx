import { useEffect, useMemo, useState } from "react"
import { useProjects } from "@/hooks/useProjects"
import { useContainers } from "@/hooks/useContainers"
import ProjectListSection from "@/components/dashboard/ProjectListSection"
import ContainerListSection from "@/components/dashboard/ContainerListSection"
import DetailPanelSection from "@/components/dashboard/DetailPanelSection"

export default function Dashboard() {
  // 현재 선택된 프로젝트와 상세 탭 상태를 관리
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [activeTab, setActiveTab] = useState("metrics")

  // 프로젝트 목록 조회 상태를 TanStack Query로 관리
  const {
    data: projectData,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
  } = useProjects()

  // API 응답에서 프로젝트 배열만 추출
  const projects = projectData?.projects ?? []

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

  // 선택된 프로젝트 기준으로 컨테이너 목록 조회 상태를 관리
  const {
    data: containerData,
    isLoading: isContainersLoading,
    isError: isContainersError,
    error: containersError,
  } = useContainers(selectedProjectId)

  // API 응답에서 컨테이너 배열만 추출
  const containers = containerData?.containers ?? []

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
          <ProjectListSection
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            isLoading={isProjectsLoading}
            isError={isProjectsError}
            error={projectsError}
          />

          <ContainerListSection
            selectedProject={selectedProject}
            selectedProjectId={selectedProjectId}
            containers={containers}
            isLoading={isContainersLoading}
            isError={isContainersError}
            error={containersError}
          />
        </div>

        <DetailPanelSection
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      </div>
    </div>
  )
}