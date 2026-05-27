// Compose Options의 services 배열을 YAML 생성을 위한 services 객체로 변환합니다.
import { COMPOSE_SERVICE_FIELD_DEFINITIONS } from "@/features/compose/constants/composeServiceFields"
import { buildEnvironmentValues } from "@/features/compose/utils/composeEnvironmentUtils"
import { buildComposeFieldValue } from "@/features/compose/utils/composeFieldValueBuilder"
import { buildPortValues } from "@/features/compose/utils/composePortUtils"

const DEFAULT_SERVICE_NAME = "app"

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

function applyOptionalFields(serviceYaml, optionalFields = {}) {
  COMPOSE_SERVICE_FIELD_DEFINITIONS.forEach((field) => {
    const fieldValue = buildComposeFieldValue(field, optionalFields[field.key])

    if (fieldValue === null) {
      return
    }

    serviceYaml[field.yamlKey] = fieldValue
  })
}

function buildServiceObject(serviceOptions) {
  const serviceYaml = {}

  if (serviceOptions.image?.trim()) {
    serviceYaml.image = serviceOptions.image.trim()
  }

  if (serviceOptions.containerName?.trim()) {
    serviceYaml.container_name = serviceOptions.containerName.trim()
  }

  applyOptionalFields(serviceYaml, serviceOptions.optionalFields)

  const portValues = buildPortValues(serviceOptions.ports)

  if (portValues.length > 0) {
    serviceYaml.ports = portValues
  }

  const environmentValues = buildEnvironmentValues(serviceOptions.environment)

  if (environmentValues.length > 0) {
    serviceYaml.environment = environmentValues
  }

  return serviceYaml
}

export function buildServicesObject(services) {
  const normalizedServices = normalizeServices(services)
  const usedServiceNames = new Set()
  const servicesYaml = {}

  normalizedServices.forEach((serviceOptions, index) => {
    const serviceName = createServiceName(
      serviceOptions.serviceName,
      index,
      usedServiceNames,
    )

    servicesYaml[serviceName] = buildServiceObject(serviceOptions)
  })

  if (Object.keys(servicesYaml).length === 0) {
    servicesYaml[DEFAULT_SERVICE_NAME] = {}
  }

  return servicesYaml
}