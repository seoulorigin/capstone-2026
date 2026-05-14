export const MONITORING_LOG_TEMPLATES = [
  {
    stream: "stdout",
    message: "server started",
  },
  {
    stream: "stdout",
    message: "health check endpoint registered",
  },
  {
    stream: "stdout",
    message: "metrics collector initialized",
  },
  {
    stream: "stdout",
    message: "request handled successfully",
  },
  {
    stream: "stderr",
    message: "temporary upstream timeout detected",
  },
  {
    stream: "stdout",
    message: "connection recovered",
  },
  {
    stream: "stdout",
    message: "container resource snapshot emitted",
  },
  {
    stream: "stderr",
    message: "retrying dependent service connection",
  },
  {
    stream: "stdout",
    message: "log stream heartbeat received",
  },
  {
    stream: "stdout",
    message: "application ready to accept requests",
  },
]