// 리소스 설정 카테고리의 Compose service field definition을 관리합니다.
export const resourceFields = [
  {
    key: "cpus",
    yamlKey: "cpus",
    label: "CPUs",
    description: "컨테이너가 사용할 CPU 제한 값입니다.",
    category: "resource",
    type: "text",
    placeholder: "0.5",
  },
]