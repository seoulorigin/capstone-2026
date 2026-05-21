import yaml from "js-yaml"

import {
  buildEnvironmentValues,
  parseEnvironment,
} from "@/features/compose/utils/composeEnvironmentUtils"
import {
  buildPortValues,
  parsePorts,
} from "@/features/compose/utils/composePortUtils"

const DEFAULT_SERVICE_NAME = "app"

function createValidationError(message) {
  return new Error(message)
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
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

  const portValues = buildPortValues(options.ports)

  if (portValues.length > 0) {
    service.ports = portValues
  }

  const environmentValues = buildEnvironmentValues(options.environment)

  if (environmentValues.length > 0) {
    service.environment = environmentValues
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

  const ports = parsePorts(service.ports)
  const environment = parseEnvironment(service.environment)

  return {
    serviceName,
    image: service.image,
    containerName: service.container_name || "",
    ports,
    environment,
  }
}