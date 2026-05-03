import yaml from "js-yaml"

const DEFAULT_SERVICE_NAME = "app"

function createValidationError(message) {
  return new Error(message)
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function parsePort(portValue) {
  if (typeof portValue !== "string" && typeof portValue !== "number") {
    throw createValidationError("ports는 문자열 또는 숫자 형식이어야 합니다.")
  }

  const portText = String(portValue)
  const [hostPort = "", containerPort = ""] = portText.split(":")

  return {
    hostPort,
    containerPort: containerPort || hostPort,
  }
}

function parseEnvironment(environment) {
  if (!environment) {
    return {
      environmentKey: "",
      environmentValue: "",
    }
  }

  if (Array.isArray(environment)) {
    const firstEnvironment = environment[0]

    if (!firstEnvironment) {
      return {
        environmentKey: "",
        environmentValue: "",
      }
    }

    if (typeof firstEnvironment !== "string") {
      throw createValidationError(
        "environment 배열은 KEY=VALUE 문자열 형식이어야 합니다.",
      )
    }

    const equalIndex = firstEnvironment.indexOf("=")

    if (equalIndex === -1) {
      throw createValidationError(
        "environment 배열은 KEY=VALUE 형식이어야 합니다.",
      )
    }

    return {
      environmentKey: firstEnvironment.slice(0, equalIndex),
      environmentValue: firstEnvironment.slice(equalIndex + 1),
    }
  }

  if (isObject(environment)) {
    const firstKey = Object.keys(environment)[0]

    if (!firstKey) {
      return {
        environmentKey: "",
        environmentValue: "",
      }
    }

    return {
      environmentKey: firstKey,
      environmentValue: String(environment[firstKey] ?? ""),
    }
  }

  throw createValidationError(
    "environment는 배열 또는 객체 형식이어야 합니다.",
  )
}

export function convertOptionsToYaml(options) {
  const serviceName = options.serviceName?.trim() || DEFAULT_SERVICE_NAME

  const composeObject = {
    services: {
      [serviceName]: {
        image: options.image?.trim() || "",
      },
    },
  }

  const service = composeObject.services[serviceName]

  if (options.containerName?.trim()) {
    service.container_name = options.containerName.trim()
  }

  if (options.hostPort?.trim() && options.containerPort?.trim()) {
    service.ports = [`${options.hostPort.trim()}:${options.containerPort.trim()}`]
  }

  if (options.environmentKey?.trim() && options.environmentValue?.trim()) {
    service.environment = [
      `${options.environmentKey.trim()}=${options.environmentValue.trim()}`,
    ]
  }

  return yaml.dump(composeObject, {
    noRefs: true,
    lineWidth: -1,
  })
}

export function convertYamlToOptions(yamlText) {
  const parsed = yaml.load(yamlText)

  if (!isObject(parsed)) {
    throw createValidationError("YAML 최상위 구조는 객체여야 합니다.")
  }

  if (!isObject(parsed.services)) {
    throw createValidationError("services 필드가 필요합니다.")
  }

  const serviceName = Object.keys(parsed.services)[0]

  if (!serviceName) {
    throw createValidationError("최소 1개의 service가 필요합니다.")
  }

  const service = parsed.services[serviceName]

  if (!isObject(service)) {
    throw createValidationError("service 설정은 객체 형식이어야 합니다.")
  }

  if (!service.image || typeof service.image !== "string") {
    throw createValidationError("service에는 image 문자열이 필요합니다.")
  }

  let hostPort = ""
  let containerPort = ""

  if (service.ports) {
    if (!Array.isArray(service.ports)) {
      throw createValidationError("ports는 배열 형식이어야 합니다.")
    }

    if (service.ports.length > 0) {
      const parsedPort = parsePort(service.ports[0])
      hostPort = parsedPort.hostPort
      containerPort = parsedPort.containerPort
    }
  }

  const { environmentKey, environmentValue } = parseEnvironment(
    service.environment,
  )

  return {
    serviceName,
    image: service.image,
    containerName: service.container_name || "",
    hostPort,
    containerPort,
    environmentKey,
    environmentValue,
  }
}