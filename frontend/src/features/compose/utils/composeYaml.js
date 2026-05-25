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

function normalizeServices(services) {
  return Array.isArray(services) ? services : []
}

function createServiceName(rawServiceName, index, usedServiceNames) {
  const fallbackName =
    index === 0 ? DEFAULT_SERVICE_NAME : `${DEFAULT_SERVICE_NAME}-${index + 1}`

  const baseName = rawServiceName?.trim() || fallbackName
  let serviceName = baseName
  let duplicateIndex = 2

  while (usedServiceNames.has(serviceName)) {
    serviceName = `${baseName}-${duplicateIndex}`
    duplicateIndex += 1
  }

  usedServiceNames.add(serviceName)

  return serviceName
}

function buildServiceObject(serviceOptions) {
  const service = {}

  if (serviceOptions.image?.trim()) {
    service.image = serviceOptions.image.trim()
  }

  if (serviceOptions.containerName?.trim()) {
    service.container_name = serviceOptions.containerName.trim()
  }

  const portValues = buildPortValues(serviceOptions.ports)

  if (portValues.length > 0) {
    service.ports = portValues
  }

  const environmentValues = buildEnvironmentValues(serviceOptions.environment)

  if (environmentValues.length > 0) {
    service.environment = environmentValues
  }

  return service
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
  const services = normalizeServices(options.services)
  const usedServiceNames = new Set()

  const composeObject = {
    services: {},
  }

  services.forEach((serviceOptions, index) => {
    const serviceName = createServiceName(
      serviceOptions.serviceName,
      index,
      usedServiceNames,
    )

    composeObject.services[serviceName] = buildServiceObject(serviceOptions)
  })

  if (Object.keys(composeObject.services).length === 0) {
    composeObject.services[DEFAULT_SERVICE_NAME] = {}
  }

  return yaml.dump(composeObject, {
    noRefs: true,
    lineWidth: -1,
  })
}