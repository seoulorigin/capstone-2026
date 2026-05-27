// 보안/권한 설정 카테고리의 Compose service field definition을 관리합니다.
export const securityFields = [
  {
    key: "privileged",
    yamlKey: "privileged",
    label: "Privileged",
    description: "컨테이너를 privileged 모드로 실행합니다.",
    category: "security",
    type: "boolean",
  },
]