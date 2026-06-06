import { useEffect, useMemo, useState } from "react"
import { buildWebSocketUrl } from "@/hooks/useWebSocketUrl"

const MAX_LOG_LENGTH = 200
const INITIAL_AUTO_RECONNECT_DELAY_MS = 3000
const MAX_AUTO_RECONNECT_DELAY_MS = 15000

const RECONNECTABLE_CONNECTION_STATUSES = new Set(["fallback", "error"])
const RUNNING_CONTAINER_STATUSES = new Set(["running", "restarting"])

function getContainerId(container) {
  return container?.container_id ?? container?.id ?? null
}

function getContainerStatus(container) {
  return String(container?.status ?? "").toLowerCase()
}

function shouldAutoReconnectByStatus(status) {
  if (!status) return true
  return RUNNING_CONTAINER_STATUSES.has(status)
}

function getAutoReconnectDelay(attempt) {
  const delay = INITIAL_AUTO_RECONNECT_DELAY_MS * 2 ** attempt
  return Math.min(delay, MAX_AUTO_RECONNECT_DELAY_MS)
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
  const [autoReconnectAttempt, setAutoReconnectAttempt] = useState(0)

  const containerId = useMemo(() => {
    return getContainerId(selectedContainer)
  }, [selectedContainer])

  const containerStatus = useMemo(() => {
    return getContainerStatus(selectedContainer)
  }, [selectedContainer])

  useEffect(() => {
    setAutoReconnectAttempt(0)
  }, [containerId])

  useEffect(() => {
    const canAutoReconnect = shouldAutoReconnectByStatus(containerStatus)

    if (connectionStatus === "connected" || !containerId || !canAutoReconnect) {
      setAutoReconnectAttempt(0)
    }
  }, [connectionStatus, containerId, containerStatus])

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
      socket = new WebSocket(
        buildWebSocketUrl(`/container/ws/logs/${containerId}`)
      )
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

  useEffect(() => {
    const canAutoReconnect = shouldAutoReconnectByStatus(containerStatus)
    const shouldReconnect =
      containerId &&
      canAutoReconnect &&
      RECONNECTABLE_CONNECTION_STATUSES.has(connectionStatus)

    if (!shouldReconnect) return

    const timeoutId = window.setTimeout(() => {
      setAutoReconnectAttempt((current) => current + 1)
      setReconnectKey((current) => current + 1)
    }, getAutoReconnectDelay(autoReconnectAttempt))

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [containerId, containerStatus, connectionStatus, autoReconnectAttempt])

  function clearLogs() {
    setLogs([])
  }

  function togglePause() {
    setIsPaused((current) => !current)
  }

  function reconnect() {
    setAutoReconnectAttempt(0)
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