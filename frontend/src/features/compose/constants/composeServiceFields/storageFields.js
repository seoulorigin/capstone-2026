// 스토리지/파일 설정 카테고리의 Compose service field definition을 관리합니다.
export const storageFields = [
  {
    key: "tmpfs",
    yamlKey: "tmpfs",
    label: "Tmpfs",
    description: "tmpfs로 마운트할 경로 목록입니다.",
    category: "storage",
    type: "list",
    placeholder: "/tmp",
  },
]