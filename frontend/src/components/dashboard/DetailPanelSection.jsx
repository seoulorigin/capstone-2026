import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MetricsPreviewPanel from "@/components/dashboard/MetricsPreviewPanel"
import LogsPreviewPanel from "@/components/dashboard/LogsPreviewPanel"
import PanelMessage from "@/components/dashboard/PanelMessage"
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

  return (
    <section>
      <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
                상세 정보
              </CardTitle>
              <p className="text-sm text-slate-400">
                선택된 컨테이너의 리소스 메트릭과 로그 영역을 확인합니다.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onChangeTab("metrics")}
                  className={`h-8 px-3 text-xs transition-all duration-150 hover:-translate-y-[1px] ${
                    activeTab === "metrics"
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.25)] hover:bg-cyan-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                  }`}
                >
                  메트릭
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onChangeTab("logs")}
                  className={`h-8 px-3 text-xs transition-all duration-150 hover:-translate-y-[1px] ${
                    activeTab === "logs"
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.25)] hover:bg-cyan-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                  }`}
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
                  className="h-8 border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 transition-all duration-150 hover:-translate-y-[1px] hover:bg-slate-800 hover:text-slate-50 disabled:opacity-50"
                >
                  {isFetching ? "..." : "새로고침"}
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>

        <CardContent className="animate-fade-in-up">
          {!selectedContainer ? (
            <PanelMessage message="컨테이너를 선택하면 상세 메트릭과 로그를 확인할 수 있습니다." />
          ) : activeTab === "metrics" ? (
            <MetricsPreviewPanel
              selectedContainer={selectedContainer}
              selectedContainerId={selectedContainerId}
              stats={stats}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          ) : (
            <LogsPreviewPanel selectedContainer={selectedContainer} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}