// Compose 확장 필드 정의에 따라 입력 UI를 렌더링합니다.
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function normalizeList(value) {
  return Array.isArray(value) ? value : []
}

function normalizeObject(value) {
  return isPlainObject(value) ? value : {}
}

export default function ComposeDynamicField({
  idPrefix = "compose",
  field,
  value,
  onChange,
}) {
  const fieldId = `${idPrefix}-${field.key}`

  if (field.type === "select") {
    return (
      <div className="grid gap-2">
        <Label htmlFor={fieldId}>{field.label}</Label>
        <select
          id={fieldId}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-slate-500"
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {field.description && (
          <p className="text-xs text-slate-500">{field.description}</p>
        )}
      </div>
    )
  }

  if (field.type === "boolean") {
    return (
      <label
        htmlFor={fieldId}
        className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
      >
        <input
          id={fieldId}
          type="checkbox"
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 size-4 rounded border-slate-600 bg-slate-950"
        />

        <span>
          <span className="block text-sm font-medium text-slate-200">
            {field.label}
          </span>

          {field.description && (
            <span className="mt-1 block text-xs text-slate-500">
              {field.description}
            </span>
          )}
        </span>
      </label>
    )
  }

  if (field.type === "list") {
    const listValue = normalizeList(value)

    const updateItem = (index, nextValue) => {
      const nextList = listValue.map((item, itemIndex) => {
        if (itemIndex !== index) return item
        return nextValue
      })

      onChange(nextList)
    }

    const addItem = () => {
      onChange([...listValue, ""])
    }

    const removeItem = (index) => {
      const nextList = listValue.filter((_, itemIndex) => {
        return itemIndex !== index
      })

      onChange(nextList)
    }

    return (
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label>{field.label}</Label>

            {field.description && (
              <p className="mt-1 text-xs text-slate-500">
                {field.description}
              </p>
            )}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            항목 추가
          </Button>
        </div>

        {listValue.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 px-3 py-3 text-sm text-slate-500">
            추가된 값이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {listValue.map((item, index) => (
              <div
                key={`${fieldId}-${index}`}
                className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <Input
                  value={item ?? ""}
                  onChange={(event) => updateItem(index, event.target.value)}
                  placeholder={field.placeholder}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeItem(index)}
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (field.type === "object") {
    const objectValue = normalizeObject(value)

    const updateObjectField = (objectField, nextValue) => {
      onChange({
        ...objectValue,
        [objectField.key]: nextValue,
      })
    }

    return (
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
        <div>
          <Label>{field.label}</Label>

          {field.description && (
            <p className="mt-1 text-xs text-slate-500">{field.description}</p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {field.fields?.map((objectField) => (
            <div key={objectField.key} className="grid gap-2">
              <Label htmlFor={`${fieldId}-${objectField.key}`}>
                {objectField.label}
              </Label>

              <Input
                id={`${fieldId}-${objectField.key}`}
                value={objectValue[objectField.key] ?? ""}
                onChange={(event) =>
                  updateObjectField(objectField, event.target.value)
                }
                placeholder={objectField.placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{field.label}</Label>

      <Input
        id={fieldId}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
      />

      {field.description && (
        <p className="text-xs text-slate-500">{field.description}</p>
      )}
    </div>
  )
}