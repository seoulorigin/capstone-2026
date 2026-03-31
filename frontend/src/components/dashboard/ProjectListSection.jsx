// 프로젝트 목록을 표시하고 선택 기능을 제공하는 섹션 컴포넌트

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCreatedAt } from "@/lib/dashboardFormat"

export default function ProjectListSection({
  projects,
  selectedProjectId,
  onSelectProject,
  isLoading,
  isError,
  error,
}) {
  return (
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
                    onClick={() => onSelectProject(project.id)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-100 ring-1 ring-slate-900"
                        : "bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-slate-900">{project.name}</p>
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
  )
}