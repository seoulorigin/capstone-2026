// Compose 확장 필드를 카테고리별 토글 섹션으로 렌더링합니다.
import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import ComposeDynamicField from "@/features/compose/components/ComposeDynamicField"
import { COMPOSE_FIELD_CATEGORIES } from "@/features/compose/constants/composeFieldCategories"
import { getComposeFieldsByCategory } from "@/features/compose/constants/composeServiceFields"

function getFieldValue(optionalFields, fieldKey) {
  return optionalFields?.[fieldKey]
}

export default function ComposeOptionalFieldSection({
  idPrefix = "compose",
  optionalFields = {},
  onChange,
}) {
  const [openCategoryIds, setOpenCategoryIds] = useState([])

  const toggleCategory = (categoryId) => {
    setOpenCategoryIds((currentCategoryIds) => {
      if (currentCategoryIds.includes(categoryId)) {
        return currentCategoryIds.filter((currentCategoryId) => {
          return currentCategoryId !== categoryId
        })
      }

      return [...currentCategoryIds, categoryId]
    })
  }

  const updateOptionalField = (fieldKey, value) => {
    onChange({
      ...optionalFields,
      [fieldKey]: value,
    })
  }

  return (
    <div className="space-y-3">
      <div className="border-t border-slate-800 pt-5">
        <h4 className="text-sm font-medium text-slate-200">확장 필드</h4>
        <p className="mt-1 text-xs text-slate-500">
          추가 service attribute는 카테고리별로 열어서 입력할 수 있습니다.
        </p>
      </div>

      <div className="space-y-3">
        {COMPOSE_FIELD_CATEGORIES.map((category) => {
          const fields = getComposeFieldsByCategory(category.id)
          const isOpen = openCategoryIds.includes(category.id)

          if (fields.length === 0) {
            return null
          }

          return (
            <div
              key={category.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/40"
            >
              <Button
                type="button"
                variant="ghost"
                className="flex h-auto w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-900"
                onClick={() => toggleCategory(category.id)}
              >
                <span>
                  <span className="block text-sm font-medium text-slate-200">
                    {category.title}
                  </span>
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    {category.description}
                  </span>
                </span>

                <ChevronDown
                  className={`size-4 shrink-0 text-slate-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isOpen && (
                <div className="space-y-4 border-t border-slate-800 px-4 py-4">
                  {fields.map((field) => (
                    <ComposeDynamicField
                      key={field.key}
                      idPrefix={`${idPrefix}-${category.id}`}
                      field={field}
                      value={getFieldValue(optionalFields, field.key)}
                      onChange={(value) => updateOptionalField(field.key, value)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}