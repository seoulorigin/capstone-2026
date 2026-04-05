import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MetricDonutChart from "@/components/dashboard/MetricDonutChart"
import { useContainerStats } from "@/hooks/useContainerStats"

// 선택된 컨테이너의 메트릭 또는 로그 영역을 표시한다.
export default function DetailPanelSection({
  activeTab,
  onChangeTab,
  selectedContainer,
}) {
  const selectedContainerId =
    selectedContainer?.container_id ?? selectedContainer?.id ?? null

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useContainerStats(selectedContainerId)

  const cpuPercent = stats?.cpu_percent ?? 0
  const memoryMb = stats?.memory_mb ?? 0
  const memoryLimitMb = stats?.memory_limit_mb ?? 0

  const memoryPercent =
    memoryLimitMb > 0 ? (memoryMb / memoryLimitMb) * 100 : 0

  return (
    <section>
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>상세 정보</CardTitle>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={activeTab === "metrics" ? "default" : "outline"}
                onClick={() => onChangeTab("metrics")}
              >
                메트릭
              </Button>
              <Button
                type="button"
                variant={activeTab === "logs" ? "default" : "outline"}
                onClick={() => onChangeTab("logs")}
              >
                로그
              </Button>
            </div>

            {activeTab === "metrics" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => refetch()}
                disabled={!selectedContainerId || isFetching}
              >
                {isFetching ? "새로고침 중..." : "새로고침"}
              </Button>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          {!selectedContainer ? (
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              컨테이너를 선택하면 상세 메트릭과 로그를 확인할 수 있습니다.
            </div>
          ) : activeTab === "metrics" ? (
            <div className="space-y-4">
              <div className="rounded-md border bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">
                  선택된 컨테이너: {selectedContainer.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedContainer.image}
                </p>
              </div>

              {isLoading ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  리소스 메트릭을 불러오는 중입니다.
                </div>
              ) : isError ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error?.message ?? "리소스 메트릭을 불러오지 못했습니다."}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <MetricDonutChart
                    title="CPU 사용량"
                    percent={cpuPercent}
                    primaryText={`${cpuPercent.toFixed(1)}%`}
                    secondaryText={`마지막 갱신: ${new Date(
                      stats?.timestamp ?? Date.now()
                    ).toLocaleTimeString()}`}
                    color="#2563eb"
                  />

                  <MetricDonutChart
                    title="메모리 사용량"
                    percent={memoryPercent}
                    primaryText={`${memoryMb.toFixed(1)} / ${memoryLimitMb.toFixed(
                      1
                    )} MB`}
                    secondaryText={`마지막 갱신: ${new Date(stats?.timestamp ?? Date.now()).toLocaleTimeString()}`}
                    color="#16a34a"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                추후 실시간 로그 스트리밍 및 로그 검색 UI가 들어갈 영역입니다.
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
  )
}