import { useEffect, useMemo, useState } from "react"

const MAX_HISTORY_LENGTH = 16

function getContainerKey(container) {
  return container?.container_id ?? container?.id ?? "unknown"
}

function createInitialHistory(container) {
  const containerKey = getContainerKey(container)
  const now = Date.now()

  return Array.from({ length: MAX_HISTORY_LENGTH }, (_, index) => {
    const offset = MAX_HISTORY_LENGTH - index
    const tick = index + containerKey.length

    const cpuPercent = 28 + Math.sin(tick / 2) * 14 + (tick % 4) * 2.2
    const memoryPercent = 34 + Math.cos(tick / 3) * 11 + (tick % 5) * 1.8
    const memoryLimitMb = 2048
    const memoryUsageMb = (memoryLimitMb * memoryPercent) / 100

    return {
      time: new Date(now - offset * 3000).toLocaleTimeString(),
      cpu_percent: clampMetric(cpuPercent),
      memory_percent: clampMetric(memoryPercent),
      memory_usage_mb: Number(memoryUsageMb.toFixed(1)),
      memory_limit_mb: memoryLimitMb,
    }
  })
}

function createNextMetric(container, tick) {
  const containerKey = getContainerKey(container)
  const base = tick + containerKey.length

  const cpuPercent = 30 + Math.sin(base / 2) * 18 + (base % 4) * 2
  const memoryPercent = 36 + Math.cos(base / 3) * 12 + (base % 5) * 1.6
  const memoryLimitMb = 2048
  const memoryUsageMb = (memoryLimitMb * memoryPercent) / 100

  return {
    time: new Date().toLocaleTimeString(),
    cpu_percent: clampMetric(cpuPercent),
    memory_percent: clampMetric(memoryPercent),
    memory_usage_mb: Number(memoryUsageMb.toFixed(1)),
    memory_limit_mb: memoryLimitMb,
  }
}

function clampMetric(value) {
  return Math.max(0, Math.min(100, Number(value.toFixed(1))))
}

export function useMockContainerMetricHistory(selectedContainer) {
  const [tick, setTick] = useState(0)
  const [history, setHistory] = useState([])

  const containerKey = useMemo(() => {
    return getContainerKey(selectedContainer)
  }, [selectedContainer])

  useEffect(() => {
    if (!selectedContainer) {
      setHistory([])
      setTick(0)
      return
    }

    setHistory(createInitialHistory(selectedContainer))
    setTick(0)
  }, [selectedContainer, containerKey])

  useEffect(() => {
    if (!selectedContainer) return

    const intervalId = window.setInterval(() => {
      setTick((currentTick) => {
        const nextTick = currentTick + 1

        setHistory((currentHistory) => {
          const nextMetric = createNextMetric(selectedContainer, nextTick)

          return [...currentHistory, nextMetric].slice(-MAX_HISTORY_LENGTH)
        })

        return nextTick
      })
    }, 3000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [selectedContainer, containerKey])

  const latestMetric = history.at(-1) ?? null

  return {
    history,
    latestMetric,
    isMock: true,
  }
}