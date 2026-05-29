// 스토리지/파일 설정 카테고리의 Compose service field definition을 관리합니다.
export const storageFields = [
  {
    key: "volumes",
    yamlKey: "volumes",
    label: "Volumes",
    description:
      "컨테이너에 마운트할 볼륨 목록입니다.",
    category: "storage",
    type: "list",
    placeholder: "./data:/data",
  },
  {
    key: "volumesFrom",
    yamlKey: "volumes_from",
    label: "Volumes From",
    description: "다른 service 또는 container의 볼륨을 참조합니다.",
    category: "storage",
    type: "list",
    placeholder: "backend",
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
    key: "configs",
    yamlKey: "configs",
    label: "Configs",
    description:
      "service에서 사용할 config 이름 목록입니다.",
    category: "storage",
    type: "list",
    placeholder: "app_config",
  },
  {
    key: "secrets",
    yamlKey: "secrets",
    label: "Secrets",
    description:
      "service에서 사용할 secret 이름 목록입니다.",
    category: "storage",
    type: "list",
    placeholder: "app_secret",
  },
  {
    key: "credentialSpec",
    yamlKey: "credential_spec",
    label: "Credential Spec",
    description:
      "Windows container credential spec 설정입니다.",
    category: "storage",
    type: "object",
    fields: [
      {
        key: "file",
        yamlKey: "file",
        label: "File",
        description: "credential spec 파일 경로입니다.",
        type: "text",
        placeholder: "my-credential-spec.json",
      },
      {
        key: "registry",
        yamlKey: "registry",
        label: "Registry",
        description: "credential spec registry 값입니다.",
        type: "text",
        placeholder: "my-credential-spec",
      },
    ],
  },
]