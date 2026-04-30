// Compose 옵션 → YAML / YAML → 옵션 변환 유틸

import yaml from "js-yaml"

// 옵션 → YAML
export function convertOptionsToYaml(options) {
  const {
    serviceName,
    image,
    containerName,
    hostPort,
    containerPort,
    environmentKey,
    environmentValue,
  } = options

  const composeObject = {
    services: {
      [serviceName]: {
        image: image || "",
      },
    },
  }

  // container_name
  if (containerName) {
    composeObject.services[serviceName].container_name = containerName
  }

  // ports
  if (hostPort && containerPort) {
    composeObject.services[serviceName].ports = [
      `${hostPort}:${containerPort}`,
    ]
  }

  // environment
  if (environmentKey && environmentValue) {
    composeObject.services[serviceName].environment = [
      `${environmentKey}=${environmentValue}`,
    ]
  }

  return yaml.dump(composeObject, {
    noRefs: true,
  })
}

// YAML → 옵션
export function convertYamlToOptions(yamlText) {
  try {
    const parsed = yaml.load(yamlText)

    const services = parsed?.services || {}
    const serviceName = Object.keys(services)[0]

    if (!serviceName) {
      throw new Error("service 없음")
    }

    const service = services[serviceName]

    // ports 파싱
    let hostPort = ""
    let containerPort = ""

    if (service.ports && service.ports.length > 0) {
      const [host, container] = service.ports[0].split(":")
      hostPort = host
      containerPort = container
    }

    // environment 파싱
    let environmentKey = ""
    let environmentValue = ""

    if (service.environment && service.environment.length > 0) {
      const [key, value] = service.environment[0].split("=")
      environmentKey = key
      environmentValue = value
    }

    return {
      serviceName,
      image: service.image || "",
      containerName: service.container_name || "",
      hostPort,
      containerPort,
      environmentKey,
      environmentValue,
    }
  } catch (error) {
    throw new Error("YAML 파싱 실패")
  }
}