function toWebSocketProtocol(protocol) {
  return protocol === "https:" ? "wss:" : "ws:"
}

function removeTrailingSlash(value) {
  return String(value ?? "").replace(/\/$/, "")
}

function convertHttpUrlToWsUrl(url) {
  if (!url) return ""

  return removeTrailingSlash(url)
    .replace(/^https:\/\//, "wss://")
    .replace(/^http:\/\//, "ws://")
}

export function getWebSocketBaseUrl() {
  const explicitWsBaseUrl = import.meta.env.VITE_WS_BASE_URL
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL

  if (explicitWsBaseUrl) {
    return removeTrailingSlash(explicitWsBaseUrl)
  }

  if (apiBaseUrl) {
    return convertHttpUrlToWsUrl(apiBaseUrl)
  }

  const { protocol, hostname } = window.location

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "ws://localhost:8000"
  }

  return `${toWebSocketProtocol(protocol)}//${window.location.host}`
}

export function buildWebSocketUrl(path) {
  const normalizedPath = String(path ?? "").startsWith("/")
    ? path
    : `/${path}`

  return `${getWebSocketBaseUrl()}${normalizedPath}`
}