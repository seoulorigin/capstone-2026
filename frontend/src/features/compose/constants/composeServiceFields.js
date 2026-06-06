// Compose service 확장 필드 정의를 카테고리별 definition 파일에서 모아 관리합니다.
import { buildFields } from "@/features/compose/constants/composeServiceFields/buildFields"
import { executionFields } from "@/features/compose/constants/composeServiceFields/executionFields"
import { lifecycleFields } from "@/features/compose/constants/composeServiceFields/lifecycleFields"
import { networkFields } from "@/features/compose/constants/composeServiceFields/networkFields"
import { operationFields } from "@/features/compose/constants/composeServiceFields/operationFields"
import { resourceFields } from "@/features/compose/constants/composeServiceFields/resourceFields"
import { securityFields } from "@/features/compose/constants/composeServiceFields/securityFields"
import { storageFields } from "@/features/compose/constants/composeServiceFields/storageFields"

export const COMPOSE_SERVICE_FIELD_DEFINITIONS = [
  ...executionFields,
  ...lifecycleFields,
  ...buildFields,
  ...networkFields,
  ...storageFields,
  ...resourceFields,
  ...securityFields,
  ...operationFields,
]

export function getComposeFieldsByCategory(categoryId) {
  return COMPOSE_SERVICE_FIELD_DEFINITIONS.filter((field) => {
    return field.category === categoryId
  })
}