// 빌드 설정 카테고리의 Compose service field definition을 관리합니다.
export const buildFields = [
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
]