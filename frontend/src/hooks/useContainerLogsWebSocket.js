import { useEffect, useMemo, useState } from "react"
import { buildWebSocketUrl } from "@/hooks/useWebSocketUrl"

const MAX_LOG_LENGTH = 200

function getContainerId(container) {
  return container?.container_id ?? container?.id ?? null
}

function normalizeLogPayload(payload) {
  return {
    time:
      payload?.time ??
      new Date(payload?.timestamp ?? Date.now()).toLocaleTimeString(),
    stream: payload?.stream ?? "stdout",
    message: payload?.message ?? "",
  }
}

export function useContainerLogsWebSocket(selectedContainer) {
  const [logs, setLogs] = useState([])
  const [isPaused, setIsPaused] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("idle")
  const [error, setError] = useState(null)
  const [reconnectKey, setReconnectKey] = useState(0)

  const containerId = useMemo(() => {
    return getContainerId(selectedContainer)
  }, [selectedContainer])

  useEffect(() => {
    if (!containerId) {
      setLogs([])
      setIsPaused(false)
      setConnectionStatus("idle")
      setError(null)
      return
    }

    let socket = null
    let closedByCleanup = false

    setLogs([])
    setIsPaused(false)
    setConnectionStatus("connecting")
    setError(null)

    try {
      socket = new WebSocket(buildWebSocketUrl(`/ws/logs/${containerId}`))
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
        const normalizedLog = normalizeLogPayload(payload)

        setLogs((currentLogs) => {
          return [...currentLogs, normalizedLog].slice(-MAX_LOG_LENGTH)
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
  }, [containerId, reconnectKey])

  function clearLogs() {
    setLogs([])
  }

  function togglePause() {
    setIsPaused((current) => !current)
  }

  function reconnect() {
    setReconnectKey((current) => current + 1)
  }

  return {
    logs,
    isPaused,
    connectionStatus,
    error,
    isMock: false,
    isConnected: connectionStatus === "connected",
    clearLogs,
    togglePause,
    reconnect,
  }
}