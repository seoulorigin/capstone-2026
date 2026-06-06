// Compose environment 옵션의 YAML 변환 및 파싱을 처리합니다.
function createValidationError(message) {
  return new Error(message)
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function normalizeEnvironment(environment) {
  return Array.isArray(environment) ? environment : []
}

function parseEnvironmentItem(environmentItem) {
  if (typeof environmentItem !== "string") {
    throw createValidationError(
      "environment 배열은 KEY=VALUE 문자열 형식이어야 합니다.",
    )
  }

  const equalIndex = environmentItem.indexOf("=")

  if (equalIndex === -1) {
    throw createValidationError(
      "environment 배열은 KEY=VALUE 형식이어야 합니다.",
    )
  }

  return {
    key: environmentItem.slice(0, equalIndex).trim(),
    value: environmentItem.slice(equalIndex + 1),
  }
}

export function parseEnvironment(environment) {
  if (!environment) {
    return []
  }

  if (Array.isArray(environment)) {
    return environment.map(parseEnvironmentItem).filter((environmentItem) => {
      return environmentItem.key
    })
  }

  if (isObject(environment)) {
    return Object.entries(environment)
      .map(([key, value]) => {
        return {
          key,
          value: String(value ?? ""),
        }
      })
      .filter((environmentItem) => {
        return environmentItem.key
      })
  }

  throw createValidationError(
    "environment는 배열 또는 객체 형식이어야 합니다.",
  )
}

export function buildEnvironmentValues(environment) {
  return normalizeEnvironment(environment)
    .map((environmentItem) => {
      const key = environmentItem.key?.trim() ?? ""

      if (!key) {
        return null
      }

      return `${key}=${environmentItem.value ?? ""}`
    })
    .filter(Boolean)
}