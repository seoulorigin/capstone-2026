import { useEffect, useMemo, useState } from "react"
import { MONITORING_LOG_TEMPLATES } from "@/mocks/data/monitoringLogs"

const MAX_LOG_LENGTH = 40
const INITIAL_LOG_LENGTH = 10

function getContainerKey(container) {
  return container?.container_id ?? container?.id ?? "unknown"
}

function getCurrentTime() {
  return new Date().toLocaleTimeString()
}

function createLog(container, index) {
  const containerName = container?.name ?? "unknown-container"
  const template =
    MONITORING_LOG_TEMPLATES[index % MONITORING_LOG_TEMPLATES.length]

  return {
    time: getCurrentTime(),
    stream: template.stream,
    message: `[${containerName}] ${template.message}`,
  }
}

function createInitialLogs(container) {
  return Array.from({ length: INITIAL_LOG_LENGTH }, (_, index) => {
    const containerName = container?.name ?? "unknown-container"
    const template =
      MONITORING_LOG_TEMPLATES[index % MONITORING_LOG_TEMPLATES.length]

    return {
      time: new Date(Date.now() - (INITIAL_LOG_LENGTH - index) * 2000)
        .toLocaleTimeString(),
      stream: template.stream,
      message: `[${containerName}] ${template.message}`,
    }
  })
}

export function useMockContainerLogs(selectedContainer) {
  const [logs, setLogs] = useState([])
  const [tick, setTick] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const containerKey = useMemo(() => {
    return getContainerKey(selectedContainer)
  }, [selectedContainer])

  useEffect(() => {
    if (!selectedContainer) {
      setLogs([])
      setTick(0)
      setIsPaused(false)
      return
    }

    setLogs(createInitialLogs(selectedContainer))
    setTick(0)
    setIsPaused(false)
  }, [selectedContainer, containerKey])

  useEffect(() => {
    if (!selectedContainer || isPaused) return

    const intervalId = window.setInterval(() => {
      setTick((currentTick) => {
        const nextTick = currentTick + 1

        setLogs((currentLogs) => {
          const nextLog = createLog(selectedContainer, nextTick)

          return [...currentLogs, nextLog].slice(-MAX_LOG_LENGTH)
        })

        return nextTick
      })
    }, 2200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [selectedContainer, containerKey, isPaused])

  function clearLogs() {
    setLogs([])
  }

  function togglePause() {
    setIsPaused((current) => !current)
  }

  return {
    logs,
    isPaused,
    isMock: true,
    clearLogs,
    togglePause,
  }
}