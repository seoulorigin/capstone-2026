import { useEffect, useMemo, useState } from "react"
import { buildWebSocketUrl } from "@/hooks/useWebSocketUrl"

const MAX_HISTORY_LENGTH = 16

function getContainerId(container) {
  return container?.container_id ?? container?.id ?? null
}

function normalizeMetricPayload(payload, selectedContainer) {
  const memoryUsageMb =
    Number(payload?.memory_usage_mb ?? payload?.memory_mb ?? 0)

  const memoryLimitMb = Number(payload?.memory_limit_mb ?? 0)

  const memoryPercent =
    payload?.memory_percent != null
      ? Number(payload.memory_percent)
      : memoryLimitMb > 0
      ? (memoryUsageMb / memoryLimitMb) * 100
      : 0

  return {
    id: payload?.id ?? payload?.container_id ?? getContainerId(selectedContainer),
    name: payload?.name ?? selectedContainer?.name ?? "unknown-container",
    status: payload?.status ?? selectedContainer?.status ?? "unknown",
    time: payload?.time ?? new Date(payload?.timestamp ?? Date.now()).toLocaleTimeString(),
    timestamp: payload?.timestamp ?? new Date().toISOString(),
    cpu_percent: clampMetric(Number(payload?.cpu_percent ?? 0)),
    memory_usage_mb: Number(memoryUsageMb.toFixed(1)),
    memory_limit_mb: Number(memoryLimitMb.toFixed(1)),
    memory_percent: clampMetric(memoryPercent),
  }
}

function clampMetric(value) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, Number(value.toFixed(1))))
}

export function useContainerMetricsWebSocket(selectedContainer) {
  const [history, setHistory] = useState([])
  const [latestMetric, setLatestMetric] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("idle")
  const [error, setError] = useState(null)

  const containerId = useMemo(() => {
    return getContainerId(selectedContainer)
  }, [selectedContainer])

  useEffect(() => {
    if (!containerId) {
      setHistory([])
      setLatestMetric(null)
      setConnectionStatus("idle")
      setError(null)
      return
    }

    let socket = null
    let closedByCleanup = false

    setHistory([])
    setLatestMetric(null)
    setConnectionStatus("connecting")
    setError(null)

    try {
      socket = new WebSocket(buildWebSocketUrl(`/ws/metrics/${containerId}`))
    } catch (e) {
      setConnectionStatus("fallback")
      setError(e)
      return
    }

    socket.onopen = () => {
      if (closedByCleanup) return
      setConnectionStatus("connected")
      setError(null)
    }

    socket.onmessage = (event) => {
      if (closedByCleanup) return

      try {
        const payload = JSON.parse(event.data)
        const normalizedMetric = normalizeMetricPayload(payload, selectedContainer)

        setLatestMetric(normalizedMetric)
        setHistory((currentHistory) => {
          return [...currentHistory, normalizedMetric].slice(-MAX_HISTORY_LENGTH)
        })
      } catch (e) {
        setConnectionStatus("error")
        setError(e)
      }
    }

    socket.onerror = (event) => {
      if (closedByCleanup) return
      setConnectionStatus("fallback")
      setError(event)
    }

    socket.onclose = () => {
      if (closedByCleanup) return
      setConnectionStatus("fallback")
    }

    return () => {
      closedByCleanup = true

      if (socket) {
        socket.close()
      }
    }
  }, [containerId, selectedContainer])

  return {
    history,
    latestMetric,
    connectionStatus,
    error,
    isMock: false,
    isConnected: connectionStatus === "connected",
  }
}