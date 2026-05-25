import yaml from "js-yaml"

import { buildServicesObject } from "@/features/compose/utils/composeServiceYamlBuilder"

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
  const composeObject = {
    services: buildServicesObject(options.services),
  }

  return yaml.dump(composeObject, {
    noRefs: true,
    lineWidth: -1,
  })
}