import { http, HttpResponse } from "msw"

// 컨테이너별 polling 횟수를 기억해서 호출될 때마다 수치가 조금씩 변하게 만든다.
const statsTickByContainer = new Map()

function getNextTick(containerId) {
  const current = statsTickByContainer.get(containerId) ?? 0
  const next = current + 1
  statsTickByContainer.set(containerId, next)
  return next
}

function makeCpuPercent(tick) {
  const value = 30 + Math.sin(tick / 2) * 20 + (tick % 4) * 1.8
  return Math.max(0, Math.min(100, Number(value.toFixed(1))))
}

function makeMemoryMb(tick, memoryLimitMb) {
  const value = 320 + Math.sin(tick / 3) * 80 + (tick % 5) * 5
  return Math.max(0, Math.min(memoryLimitMb, Number(value.toFixed(1))))
}

export const handlers = [
  // MSW 동작 여부를 확인하기 위한 테스트용 엔드포인트
  http.get("/api/health", () => {
    return HttpResponse.json({
      message: "MSW is running",
    })
  }),

  // 선택된 컨테이너의 mock 리소스 메트릭 응답
  http.get("/container/:containerId/stats", ({ params }) => {
    const containerId = String(params.containerId)
    const tick = getNextTick(containerId)

    const memoryLimitMb = 1024
    const cpuPercent = makeCpuPercent(tick)
    const memoryMb = makeMemoryMb(tick, memoryLimitMb)

    return HttpResponse.json({
      container_id: containerId,
      cpu_percent: cpuPercent,
      memory_mb: memoryMb,
      memory_limit_mb: memoryLimitMb,
      timestamp: new Date().toISOString(),
    })
  }),
]