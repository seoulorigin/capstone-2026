// 메트릭/로그 탭 UI를 포함한 상세 정보 패널 컴포넌트

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DetailPanelSection({ activeTab, onChangeTab }) {
  return (
    <section>
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>상세 정보</CardTitle>

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
        </CardHeader>

        <CardContent>
          {activeTab === "metrics" ? (
            <div className="space-y-3">
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                추후 CPU / Memory 실시간 차트와 메트릭 히스토리 UI가 들어갈
                영역입니다.
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-sm font-medium text-slate-700">CPU 사용량</p>
                  <div className="mt-3 h-24 rounded-md bg-slate-100" />
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-sm font-medium text-slate-700">
                    메모리 사용량
                  </p>
                  <div className="mt-3 h-24 rounded-md bg-slate-100" />
                </div>
              </div>
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