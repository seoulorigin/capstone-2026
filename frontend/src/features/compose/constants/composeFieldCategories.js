// Compose 확장 필드 카테고리와 표시 순서를 정의합니다.
export const COMPOSE_FIELD_CATEGORIES = [
  {
    id: "execution",
    title: "실행 설정",
    description: "컨테이너 실행 명령과 작업 디렉터리 관련 옵션입니다.",
  },
  {
    id: "lifecycle",
    title: "컨테이너 동작 설정",
    description: "재시작 정책, 터미널, 읽기 전용 실행 등 동작 관련 옵션입니다.",
  },
  {
    id: "build",
    title: "빌드 설정",
    description: "이미지 빌드에 필요한 기본 경로 설정입니다.",
  },
  {
    id: "network",
    title: "네트워크 설정",
    description: "호스트명과 네트워크 노출 관련 옵션입니다.",
  },
  {
    id: "storage",
    title: "스토리지/파일 설정",
    description: "임시 파일 시스템과 마운트 관련 옵션입니다.",
  },
  {
    id: "resource",
    title: "리소스 설정",
    description: "CPU, 메모리 등 컨테이너 리소스 제한 관련 옵션입니다.",
  },
  {
    id: "security",
    title: "보안/권한 설정",
    description: "권한, capability, 격리 수준 관련 옵션입니다.",
  },
  {
    id: "operation",
    title: "서비스 관계/운영/배포 설정",
    description: "프로필, 의존 관계, 운영 설정 관련 옵션입니다.",
  },
]