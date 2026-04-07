import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatusBadge from "@/components/dashboard/StatusBadge"

// 컨테이너 목록과 상태를 표시하고 선택된 컨테이너를 강조
export default function ContainerListSection({
  containers,
  isLoading,
  isError,
  error,
  selectedContainerId,
  onSelectContainer,
}) {
  return (
    <section>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>컨테이너 목록 및 상태</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm font-medium text-slate-900">
              현재 서버의 컨테이너 상태를 조회합니다.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              선택한 컨테이너의 리소스 메트릭은 하단 상세 정보에서 확인할 수
              있습니다.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="grid grid-cols-3 border-b bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
              <span>이름</span>
              <span>이미지</span>
              <span>상태</span>
            </div>

            {isLoading ? (
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
                {containers.map((container) => {
                  const currentId = container.container_id ?? container.id
                  const isSelected = selectedContainerId === currentId

                  return (
                    <li key={currentId}>
                      <button
                        type="button"
                        onClick={() => onSelectContainer(container)}
                        className={`grid w-full grid-cols-3 items-center px-4 py-3 text-left text-sm transition ${
                          isSelected
                            ? "bg-slate-100"
                            : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-medium text-slate-900">
                          {container.name}
                        </span>
                        <span className="text-slate-600">{container.image}</span>
                        <StatusBadge status={container.status} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}