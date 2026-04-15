// 대시보드 preview용 컨테이너 로그 mock 데이터
export const CONTAINER_LOG_PREVIEW = [
  {
    time: "12:00:01",
    level: "INFO",
    message: "Container process started successfully.",
  },
  {
    time: "12:00:03",
    level: "INFO",
    message: "Health check endpoint registered.",
  },
  {
    time: "12:00:05",
    level: "WARN",
    message: "Retrying upstream connection to dependent service.",
  },
  {
    time: "12:00:08",
    level: "INFO",
    message: "Connection established with redis-cache.",
  },
  {
    time: "12:00:11",
    level: "INFO",
    message: "Metrics polling loop initialized.",
  },
  {
    time: "12:00:16",
    level: "ERROR",
    message: "Temporary timeout detected while reading resource usage.",
  },
  {
    time: "12:00:19",
    level: "INFO",
    message: "Recovered from timeout and resumed normal operation.",
  },
  {
    time: "12:00:25",
    level: "INFO",
    message: "Application ready to accept requests.",
  },
]