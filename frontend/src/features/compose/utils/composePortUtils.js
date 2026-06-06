// Compose ports 옵션의 YAML 변환 및 파싱을 처리합니다.
function createValidationError(message) {
  return new Error(message)
}

function createEmptyPort() {
  return {
    hostPort: "",
    containerPort: "",
  }
}

function normalizePorts(ports) {
  return Array.isArray(ports) ? ports : []
}

function parsePort(portValue) {
  if (typeof portValue !== "string" && typeof portValue !== "number") {
    throw createValidationError("ports는 문자열 또는 숫자 형식이어야 합니다.")
  }

  const portText = String(portValue).trim()

  if (!portText) {
    return createEmptyPort()
  }

  if (portText.includes("/")) {
    throw createValidationError(
      "ports protocol 형식은 아직 지원하지 않습니다.",
    )
  }

  const portParts = portText.split(":")

  if (portParts.length > 2) {
    throw createValidationError(
      "ports는 host:container short syntax만 지원합니다.",
    )
  }

  const [hostPort = "", containerPort = ""] = portParts

  return {
    hostPort: hostPort.trim(),
    containerPort: (containerPort || hostPort).trim(),
  }
}

export function parsePorts(ports) {
  if (!ports) {
    return []
  }

  if (!Array.isArray(ports)) {
    throw createValidationError("ports는 배열 형식이어야 합니다.")
  }

  return ports.map(parsePort).filter((port) => {
    return port.hostPort || port.containerPort
  })
}

export function buildPortValues(ports) {
  return normalizePorts(ports)
    .map((port) => {
      const hostPort = port.hostPort?.trim() ?? ""
      const containerPort = port.containerPort?.trim() ?? ""

      if (!hostPort || !containerPort) {
        return null
      }

      return `${hostPort}:${containerPort}`
    })
    .filter(Boolean)
}