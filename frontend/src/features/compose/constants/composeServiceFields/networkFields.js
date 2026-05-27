// 네트워크 설정 카테고리의 Compose service field definition을 관리합니다.
export const networkFields = [
  {
    key: "hostname",
    yamlKey: "hostname",
    label: "Hostname",
    description: "컨테이너 내부에서 사용할 hostname입니다.",
    category: "network",
    type: "text",
    placeholder: "frontend-host",
  },
]