// 선택된 프로젝트의 컨테이너 목록과 상태를 표시하는 섹션 컴포넌트

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatUpdatedAt } from "@/lib/dashboardFormat"
import StatusBadge from "@/components/dashboard/StatusBadge"

export default function ContainerListSection({
  selectedProject,
  selectedProjectId,
  containers,
  isLoading,
  isError,
  error,
}) {
  return (
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
                {selectedProject.description ?? "설명이 없는 프로젝트입니다."}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              먼저 프로젝트를 선택해주세요.
            </div>
          )}

          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="grid grid-cols-4 border-b bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
              <span>이름</span>
              <span>이미지</span>
              <span>상태</span>
              <span>업데이트</span>
            </div>

            {selectedProjectId === null ? (
              <div className="px-4 py-6 text-sm text-slate-500">
                먼저 프로젝트를 선택해주세요.
              </div>
            ) : isLoading ? (
              <div className="px-4 py-6 text-sm text-slate-500">
                컨테이너 목록을 불러오는 중입니다.
              </div>
            ) : isError ? (
              <div className="px-4 py-6 text-sm text-red-600">
                {error?.message ?? "컨테이너 목록을 불러오지 못했습니다."}
              </div>
            ) : containers.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">
                표시할 컨테이너가 없습니다.
              </div>
            ) : (
              <ul className="divide-y">
                {containers.map((container) => (
                  <li
                    key={container.id}
                    className="grid grid-cols-4 items-center px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-slate-900">
                      {container.name}
                    </span>
                    <span className="text-slate-600">{container.image}</span>
                    <StatusBadge status={container.status} />
                    <span className="text-slate-500">
                      {formatUpdatedAt(container.updated_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}