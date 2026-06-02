// field definition 기반 확장 필드 값을 YAML에 넣을 수 있는 값으로 변환합니다.
// 필드별 의존성 검증은 수행하지 않고, 빈 값 제외와 단순 타입 변환만 처리합니다.
function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function normalizeList(value) {
  return Array.isArray(value) ? value : []
}

function normalizeObjectList(value) {
  return Array.isArray(value) ? value.filter(isPlainObject) : []
}

function isEmptyFieldValue(value) {
  if (value === undefined || value === null || value === "") {
    return true
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  if (isPlainObject(value)) {
    return Object.keys(value).length === 0
  }

  return false
}

function buildTextValue(value) {
  if (typeof value !== "string") {
    return isEmptyFieldValue(value) ? null : value
  }

  const trimmedValue = value.trim()

  return trimmedValue ? trimmedValue : null
}

function buildBooleanValue(value) {
  return value === true ? true : null
}

function buildListValue(value) {
  const listValue = normalizeList(value)
    .map((item) => {
      return typeof item === "string" ? item.trim() : item
    })
    .filter((item) => {
      return !isEmptyFieldValue(item)
    })

  return listValue.length > 0 ? listValue : null
}

function parseKeyValueItem(item) {
  if (typeof item !== "string") {
    return null
  }

  const trimmedItem = item.trim()

  if (!trimmedItem) {
    return null
  }

  const separatorIndex = trimmedItem.indexOf("=")

  if (separatorIndex <= 0) {
    return null
  }

  const key = trimmedItem.slice(0, separatorIndex).trim()
  const value = trimmedItem.slice(separatorIndex + 1).trim()

  if (!key || !value) {
    return null
  }

  return {
    key,
    value,
  }
}

function buildKeyValueListValue(value) {
  const result = {}

  normalizeList(value).forEach((item) => {
    const parsedItem = parseKeyValueItem(item)

    if (parsedItem === null) {
      return
    }

    result[parsedItem.key] = parsedItem.value
  })

  return Object.keys(result).length > 0 ? result : null
}

function buildObjectValue(field, value) {
  if (!isPlainObject(value)) {
    return null
  }

  const result = {}

  field.fields?.forEach((objectField) => {
    const objectFieldValue = value[objectField.key]
    const nextValue = buildComposeFieldValue(objectField, objectFieldValue)

    if (nextValue === null) {
      return
    }

    result[objectField.yamlKey] = nextValue
  })

  return Object.keys(result).length > 0 ? result : null
}

function buildObjectListValue(field, value) {
  const objectListValue = normalizeObjectList(value)
    .map((item) => {
      return buildObjectValue(field, item)
    })
    .filter((item) => {
      return item !== null
    })

  return objectListValue.length > 0 ? objectListValue : null
}

export function buildComposeFieldValue(field, value) {
  if (field.type === "boolean") {
    return buildBooleanValue(value)
  }

  if (field.type === "list") {
    return buildListValue(value)
  }

  if (field.type === "keyValueList") {
    return buildKeyValueListValue(value)
  }

  if (field.type === "object") {
    return buildObjectValue(field, value)
  }

  if (field.type === "objectList") {
    return buildObjectListValue(field, value)
  }

  return buildTextValue(value)
}