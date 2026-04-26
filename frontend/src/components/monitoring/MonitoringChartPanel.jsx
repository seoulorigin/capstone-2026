import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MonitoringChartPanel({ selectedContainer }) {
  return (
    <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">
              CPU / Memory 라인차트
            </CardTitle>
            <p className="mt-2 text-sm text-slate-400">
              선택한 컨테이너의 리소스 변화를 시간 흐름 기준으로 표시합니다.
            </p>
          </div>

          <span className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            Recharts 준비 영역
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {!selectedContainer ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
            컨테이너를 선택하면 CPU / Memory 라인차트가 표시됩니다.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            <ChartPlaceholder
              title="CPU Usage"
              value="--%"
              helper="mock history 연결 예정"
            />

            <ChartPlaceholder
              title="Memory Usage"
              value="--%"
              helper="mock history 연결 예정"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ChartPlaceholder({ title, value, helper }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]">
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Metric
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-100">{title}</p>
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
          {value}
        </span>
      </div>

      <div className="flex h-[260px] items-center justify-center bg-slate-950/40 p-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-full border border-cyan-500/20 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.10)]" />
          <p className="mt-4 text-sm font-medium text-slate-300">
            LineChart Area
          </p>
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
      </div>
    </div>
  )
}