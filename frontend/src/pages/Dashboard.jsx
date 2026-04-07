import { useEffect, useMemo, useState } from "react"
import MainLayout from "@/layouts/MainLayout"
import { useContainers } from "@/hooks/useContainers"
import ContainerListSection from "@/components/dashboard/ContainerListSection"
import DetailPanelSection from "@/components/dashboard/DetailPanelSection"

// 대시보드에서 컨테이너 목록과 선택된 컨테이너의 상세 정보를 함께 관리한다.
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("metrics")
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [activeMenu, setActiveMenu] = useState("dashboard")

  const {
    data: containerData,
    isLoading: isContainersLoading,
    isError: isContainersError,
    error: containersError,
  } = useContainers()

  const containers = Array.isArray(containerData)
    ? containerData
    : containerData?.containers ?? []

  // 컨테이너 목록이 로드되면 첫 번째 컨테이너를 기본 선택한다.
  useEffect(() => {
    if (containers.length > 0 && !selectedContainer) {
      setSelectedContainer(containers[0])
    }
  }, [containers, selectedContainer])

  const selectedContainerId =
    selectedContainer?.container_id ?? selectedContainer?.id ?? null

  const summary = useMemo(() => {
    const total = containers.length
    const running = containers.filter(
      (container) => String(container.status ?? "").toLowerCase() === "running"
    ).length
    const restarting = containers.filter(
      (container) =>
        String(container.status ?? "").toLowerCase() === "restarting"
    ).length
    const inactive = containers.filter((container) =>
      ["stopped", "exited", "paused"].includes(
        String(container.status ?? "").toLowerCase()
      )
    ).length

    return { total, running, restarting, inactive }
  }, [containers])

  return (
    <MainLayout activeMenu={activeMenu} onChangeMenu={setActiveMenu}>
      <div className="space-y-7">
        <header className="overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_24%),linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
          <div className="flex flex-col gap-8 p-7 xl:flex-row xl:items-stretch xl:justify-between xl:p-9">
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-400">
                    Container Monitoring
                  </p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    Monitoring active
                  </span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-slate-50 xl:text-[42px]">
                    컨테이너 기반 대시보드
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-slate-400 xl:text-[15px]">
                    서버에 존재하는 컨테이너 목록과 현재 상태를 확인하고, 선택한
                    컨테이너의 리소스 메트릭을 모니터링할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <HeaderMetaChip label="모드" value="Container View" />
                <HeaderMetaChip
                  label="상태 기준"
                  value="running / restarting / inactive"
                />
                <HeaderMetaChip label="데이터" value="API + Mock Preview" />
              </div>
            </div>

            <div className="xl:w-[420px]">
              <div className="rounded-2xl border border-slate-800/90 bg-slate-950/40 p-3 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Overview
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      현재 운영 상태 요약
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
                  <SummaryCard
                    label="전체"
                    value={summary.total}
                    tone="default"
                    helper="현재 추적 중"
                  />
                  <SummaryCard
                    label="실행 중"
                    value={summary.running}
                    tone="running"
                    helper="정상 동작"
                  />
                  <SummaryCard
                    label="재시작 중"
                    value={summary.restarting}
                    tone="restarting"
                    helper="상태 확인 필요"
                  />
                  <SummaryCard
                    label="비활성"
                    value={summary.inactive}
                    tone="inactive"
                    helper="중지 또는 종료"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-7 xl:grid-cols-[1fr_1.45fr]">
          <ContainerListSection
            containers={containers}
            isLoading={isContainersLoading}
            isError={isContainersError}
            error={containersError}
            selectedContainerId={selectedContainerId}
            onSelectContainer={setSelectedContainer}
          />

          <DetailPanelSection
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            selectedContainer={selectedContainer}
          />
        </div>
      </div>
    </MainLayout>
  )
}

function SummaryCard({ label, value, helper, tone = "default" }) {
  const toneClassName =
    tone === "running"
      ? "border-emerald-500/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,6,23,0.88))]"
      : tone === "restarting"
      ? "border-amber-500/20 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,6,23,0.88))]"
      : tone === "inactive"
      ? "border-slate-700 bg-[radial-gradient(circle_at_top_left,rgba(100,116,139,0.14),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,6,23,0.88))]"
      : "border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,6,23,0.88))]"

  const dotClassName =
    tone === "running"
      ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]"
      : tone === "restarting"
      ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.85)]"
      : tone === "inactive"
      ? "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.55)]"
      : "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.85)]"

  return (
    <div
      className={`rounded-2xl border px-4 py-4 shadow-sm transition-all ${toneClassName}`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-4xl font-semibold tracking-tight text-slate-50">
          {value}
        </p>
      </div>

      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  )
}

function HeaderMetaChip({ label, value }) {
  return (
    <div className="rounded-full border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-400 backdrop-blur-sm">
      <span className="mr-2 text-slate-500">{label}</span>
      <span className="text-slate-300">{value}</span>
    </div>
  )
}