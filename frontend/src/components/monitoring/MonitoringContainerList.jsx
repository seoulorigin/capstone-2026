import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatusBadge from "@/components/dashboard/StatusBadge"

export default function MonitoringContainerList({
  containers,
  isLoading,
  isError,
  error,
  selectedContainer,
  onSelectContainer,
}) {
  const selectedContainerId =
    selectedContainer?.container_id ?? selectedContainer?.id ?? null

  return (
    <section>
      <Card className="h-full rounded-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
              컨테이너 목록
            </CardTitle>

            <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
              총 {containers.length}개
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm font-medium text-slate-200">
              상세 모니터링 대상 선택
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              선택한 컨테이너의 메트릭 변화와 로그 스트림을 우측에서 확인합니다.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <StateBox message="컨테이너 목록을 불러오는 중입니다." />
          ) : isError ? (
            <StateBox
              variant="error"
              message={error?.message ?? "컨테이너 목록을 불러오지 못했습니다."}
            />
          ) : containers.length === 0 ? (
            <StateBox message="표시할 컨테이너가 없습니다." />
          ) : (
            <ul className="space-y-3 animate-fade-in-up">
              {containers.map((container) => {
                const currentId = container.container_id ?? container.id
                const isSelected = selectedContainerId === currentId

                return (
                  <li key={currentId}>
                    <button
                      type="button"
                      onClick={() => onSelectContainer(container)}
                      className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ease-out active:scale-[0.995] ${
                        isSelected
                          ? "border-cyan-400/60 bg-cyan-500/12 shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_12px_30px_rgba(34,211,238,0.10)]"
                          : "border-slate-800 bg-slate-950/70 hover:-translate-y-[2px] hover:border-slate-700 hover:bg-slate-900/70 hover:shadow-[0_10px_25px_rgba(2,6,23,0.60)]"
                      }`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 w-1 rounded-r-full transition-all duration-200 ${
                          isSelected
                            ? "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                            : "bg-transparent group-hover:bg-slate-700"
                        }`}
                      />

                      <div className="flex flex-col gap-4">
                        <div className="min-w-0 space-y-2 pl-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full transition-all duration-200 group-hover:scale-110 ${
                                isSelected
                                  ? "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]"
                                  : "bg-cyan-400"
                              }`}
                            />

                            <p
                              className={`truncate text-sm font-semibold transition-colors duration-200 ${
                                isSelected ? "text-cyan-50" : "text-slate-100"
                              }`}
                            >
                              {container.name}
                            </p>
                          </div>

                          <p
                            className={`truncate text-sm transition-colors duration-200 ${
                              isSelected ? "text-slate-300" : "text-slate-400"
                            }`}
                          >
                            {container.image}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 pl-1">
                          <StatusBadge status={container.status} />

                          <span className="text-xs text-slate-500">
                            {currentId}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function StateBox({ message, variant = "default" }) {
  const className =
    variant === "error"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
      : "border-slate-800 bg-slate-950/70 text-slate-400"

  return (
    <div className={`rounded-2xl border p-4 text-sm ${className}`}>
      {message}
    </div>
  )
}