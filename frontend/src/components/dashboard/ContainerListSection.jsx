import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatusBadge from "@/components/dashboard/StatusBadge"

// 컨테이너 목록과 상태를 로딩/에러/빈 상태에 맞게 표시
export default function ContainerListSection({
  containers,
  isLoading,
  isError,
  error,
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
              issue 1에서는 실제 API와 연결된 목록/상태 조회를 우선 반영합니다.
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
                {containers.map((container) => (
                  <li
                    key={container.container_id ?? container.id}
                    className="grid grid-cols-3 items-center px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-slate-900">
                      {container.name}
                    </span>
                    <span className="text-slate-600">{container.image}</span>
                    <StatusBadge status={container.status} />
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