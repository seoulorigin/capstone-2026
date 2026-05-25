// Compose service 확장 필드 정의를 관리합니다.
// 후속 작업에서는 이 목록에 field definition을 추가하는 방식으로 확장합니다.
export const COMPOSE_SERVICE_FIELD_DEFINITIONS = [
  {
    key: "command",
    yamlKey: "command",
    label: "Command",
    description: "컨테이너 시작 시 실행할 명령입니다.",
    category: "execution",
    type: "text",
    placeholder: "npm run dev",
  },
  {
    key: "restart",
    yamlKey: "restart",
    label: "Restart Policy",
    description: "컨테이너 종료 시 재시작 정책입니다.",
    category: "lifecycle",
    type: "select",
    options: [
      { label: "선택 안 함", value: "" },
      { label: "no", value: "no" },
      { label: "always", value: "always" },
      { label: "on-failure", value: "on-failure" },
      { label: "unless-stopped", value: "unless-stopped" },
    ],
  },
  {
    key: "build",
    yamlKey: "build",
    label: "Build",
    description: "이미지를 빌드할 기본 context 경로입니다.",
    category: "build",
    type: "object",
    fields: [
      {
        key: "context",
        yamlKey: "context",
        label: "Context",
        type: "text",
        placeholder: "./frontend",
      },
    ],
  },
  {
    key: "hostname",
    yamlKey: "hostname",
    label: "Hostname",
    description: "컨테이너 내부에서 사용할 hostname입니다.",
    category: "network",
    type: "text",
    placeholder: "frontend-host",
  },
  {
    key: "tmpfs",
    yamlKey: "tmpfs",
    label: "Tmpfs",
    description: "tmpfs로 마운트할 경로 목록입니다.",
    category: "storage",
    type: "list",
    placeholder: "/tmp",
  },
  {
    key: "cpus",
    yamlKey: "cpus",
    label: "CPUs",
    description: "컨테이너가 사용할 CPU 제한 값입니다.",
    category: "resource",
    type: "text",
    placeholder: "0.5",
  },
  {
    key: "privileged",
    yamlKey: "privileged",
    label: "Privileged",
    description: "컨테이너를 privileged 모드로 실행합니다.",
    category: "security",
    type: "boolean",
  },
  {
    key: "profiles",
    yamlKey: "profiles",
    label: "Profiles",
    description: "Compose profile 이름 목록입니다.",
    category: "operation",
    type: "list",
    placeholder: "dev",
  },
]

export function getComposeFieldsByCategory(categoryId) {
  return COMPOSE_SERVICE_FIELD_DEFINITIONS.filter((field) => {
    return field.category === categoryId
  })
}