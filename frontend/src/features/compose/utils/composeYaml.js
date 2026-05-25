import yaml from "js-yaml"

import { buildEnvironmentValues } from "@/features/compose/utils/composeEnvironmentUtils"
import { buildPortValues } from "@/features/compose/utils/composePortUtils"

const DEFAULT_SERVICE_NAME = "app"

function createValidationError(message) {
  return new Error(message)
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

export function validateYamlSyntax(yamlText) {
  const parsed = yaml.load(yamlText)

  if (!isObject(parsed)) {
    throw createValidationError("YAML 최상위 구조는 객체여야 합니다.")
  }

  if (!isObject(parsed.services)) {
    throw createValidationError("services 필드가 필요합니다.")
  }

  return parsed
}

export function convertOptionsToYaml(options) {
  const serviceName = options.serviceName?.trim() || DEFAULT_SERVICE_NAME

  const composeObject = {
    services: {
      [serviceName]: {},
    },
  }

  const service = composeObject.services[serviceName]

  if (options.image?.trim()) {
    service.image = options.image.trim()
  }

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