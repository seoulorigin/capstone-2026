// Compose service 하나의 기본 입력 필드와 확장 필드 섹션을 렌더링합니다.
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ComposeEnvironmentFields from "@/features/compose/components/ComposeEnvironmentFields"
import ComposeOptionalFieldSection from "@/features/compose/components/ComposeOptionalFieldSection"
import ComposePortFields from "@/features/compose/components/ComposePortFields"

export default function ComposeServiceFields({
  service,
  serviceIndex,
  canRemove,
  onChange,
  onRemove,
}) {
  const updateField = (field, value) => {
    onChange({
      ...service,
      [field]: value,
    })
  }

  const serviceLabel = service.serviceName?.trim() || `service-${serviceIndex + 1}`
  const idPrefix = `service-${service.id || serviceIndex}`

  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            {serviceLabel}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            services.{serviceLabel} 하위에 생성될 설정입니다.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canRemove}
          onClick={onRemove}
        >
          서비스 삭제
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-serviceName`}>Service Name</Label>
          <Input
            id={`${idPrefix}-serviceName`}
            value={service.serviceName ?? ""}
            onChange={(event) => updateField("serviceName", event.target.value)}
            placeholder="app"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-image`}>Image</Label>
          <Input
            id={`${idPrefix}-image`}
            value={service.image ?? ""}
            onChange={(event) => updateField("image", event.target.value)}
            placeholder="nginx:latest"
          />
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor={`${idPrefix}-containerName`}>Container Name</Label>
          <Input
            id={`${idPrefix}-containerName`}
            value={service.containerName ?? ""}
            onChange={(event) =>
              updateField("containerName", event.target.value)
            }
            placeholder="my-container"
          />
        </div>
      </div>

      <ComposePortFields
        idPrefix={idPrefix}
        ports={service.ports}
        onChange={(nextPorts) => updateField("ports", nextPorts)}
      />

      <ComposeEnvironmentFields
        idPrefix={idPrefix}
        environment={service.environment}
        onChange={(nextEnvironment) =>
          updateField("environment", nextEnvironment)
        }
      />

      <ComposeOptionalFieldSection
        idPrefix={idPrefix}
        optionalFields={service.optionalFields}
        onChange={(nextOptionalFields) =>
          updateField("optionalFields", nextOptionalFields)
        }
      />
    </div>
  )
}