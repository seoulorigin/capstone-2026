// 서비스 관계/운영/배포 설정 카테고리의 Compose service field definition을 관리합니다.
export const operationFields = [
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