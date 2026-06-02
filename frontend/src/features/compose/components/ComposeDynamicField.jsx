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

function normalizeObjectList(value) {
  return Array.isArray(value) ? value.filter(isPlainObject) : []
}

function renderFieldDescription(description) {
  if (!description) {
    return null
  }

  return <p className="text-xs text-slate-500">{description}</p>
}

function renderTextListField({
  field,
  fieldId,
  value,
  onChange,
  emptyMessage = "추가된 값이 없습니다.",
}) {
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
          {emptyMessage}
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

        {renderFieldDescription(field.description)}
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
    return renderTextListField({
      field,
      fieldId,
      value,
      onChange,
    })
  }

  if (field.type === "keyValueList") {
    return renderTextListField({
      field,
      fieldId,
      value,
      onChange,
      emptyMessage: "추가된 KEY=VALUE 값이 없습니다.",
    })
  }

  if (field.type === "objectList" || field.type === "namedObjectList") {
    const objectListValue = normalizeObjectList(value)

    const addItem = () => {
      onChange([...objectListValue, {}])
    }

    const removeItem = (index) => {
      const nextList = objectListValue.filter((_, itemIndex) => {
        return itemIndex !== index
      })

      onChange(nextList)
    }

    const updateObjectListField = (index, objectField, nextValue) => {
      const nextList = objectListValue.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item
        }

        return {
          ...item,
          [objectField.key]: nextValue,
        }
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

        {objectListValue.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 px-3 py-3 text-sm text-slate-500">
            추가된 값이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {objectListValue.map((item, index) => (
              <div
                key={`${fieldId}-${index}`}
                className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-400">
                    항목 {index + 1}
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    삭제
                  </Button>
                </div>

                <div className="space-y-3">
                  {field.fields?.map((objectField) => (
                    <ComposeDynamicField
                      key={objectField.key}
                      idPrefix={`${fieldId}-${index}`}
                      field={objectField}
                      value={item[objectField.key]}
                      onChange={(nextValue) =>
                        updateObjectListField(index, objectField, nextValue)
                      }
                    />
                  ))}
                </div>
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

        <div className="space-y-3">
          {field.fields?.map((objectField) => (
            <ComposeDynamicField
              key={objectField.key}
              idPrefix={fieldId}
              field={objectField}
              value={objectValue[objectField.key]}
              onChange={(nextValue) =>
                updateObjectField(objectField, nextValue)
              }
            />
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

      {renderFieldDescription(field.description)}
    </div>
  )
}