// Compose service의 environment 배열 입력 UI를 렌더링합니다.
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ComposeArrayFieldGroup from "@/features/compose/components/ComposeArrayFieldGroup"

const emptyEnvironment = {
  key: "",
  value: "",
}

function normalizeEnvironment(environment) {
  return Array.isArray(environment) ? environment : []
}

export default function ComposeEnvironmentFields({ environment, onChange }) {
  const normalizedEnvironment = normalizeEnvironment(environment)

  const updateEnvironment = (index, field, value) => {
    const nextEnvironment = normalizedEnvironment.map(
      (environmentItem, itemIndex) => {
        if (itemIndex !== index) return environmentItem

        return {
          ...environmentItem,
          [field]: value,
        }
      },
    )

    onChange(nextEnvironment)
  }

  const addEnvironment = () => {
    onChange([...normalizedEnvironment, emptyEnvironment])
  }

  const removeEnvironment = (index) => {
    const nextEnvironment = normalizedEnvironment.filter((_, itemIndex) => {
      return itemIndex !== index
    })

    onChange(nextEnvironment)
  }

  return (
    <ComposeArrayFieldGroup
      title="Environment"
      description="KEY=VALUE 문자열 배열 형태로 YAML에 반영합니다."
      addLabel="환경변수 추가"
      emptyMessage="추가된 environment 값이 없습니다."
      items={normalizedEnvironment}
      onAdd={addEnvironment}
      onRemove={removeEnvironment}
      renderItem={(environmentItem, index) => (
        <>
          <div className="grid gap-2">
            <Label htmlFor={`environmentKey-${index}`}>Key</Label>
            <Input
              id={`environmentKey-${index}`}
              value={environmentItem.key ?? ""}
              onChange={(event) =>
                updateEnvironment(index, "key", event.target.value)
              }
              placeholder="NODE_ENV"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`environmentValue-${index}`}>Value</Label>
            <Input
              id={`environmentValue-${index}`}
              value={environmentItem.value ?? ""}
              onChange={(event) =>
                updateEnvironment(index, "value", event.target.value)
              }
              placeholder="production"
            />
          </div>
        </>
      )}
    />
  )
}