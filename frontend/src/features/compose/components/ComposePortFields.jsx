// Compose service의 ports 배열 입력 UI를 렌더링합니다.
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ComposeArrayFieldGroup from "@/features/compose/components/ComposeArrayFieldGroup"

const emptyPort = {
  hostPort: "",
  containerPort: "",
}

function normalizePorts(ports) {
  return Array.isArray(ports) ? ports : []
}

export default function ComposePortFields({ idPrefix = "compose", ports, onChange }) {
  const normalizedPorts = normalizePorts(ports)

  const updatePort = (index, field, value) => {
    const nextPorts = normalizedPorts.map((port, portIndex) => {
      if (portIndex !== index) return port

      return {
        ...port,
        [field]: value,
      }
    })

    onChange(nextPorts)
  }

  const addPort = () => {
    onChange([...normalizedPorts, emptyPort])
  }

  const removePort = (index) => {
    const nextPorts = normalizedPorts.filter((_, portIndex) => {
      return portIndex !== index
    })

    onChange(nextPorts)
  }

  return (
    <ComposeArrayFieldGroup
      title="Ports"
      description="short syntax 기준으로 host:container 형태를 지원합니다."
      addLabel="포트 추가"
      emptyMessage="추가된 port mapping이 없습니다."
      items={normalizedPorts}
      onAdd={addPort}
      onRemove={removePort}
      renderItem={(port, index) => (
        <>
          <div className="grid gap-2">
            <Label htmlFor={`${idPrefix}-hostPort-${index}`}>Host Port</Label>
            <Input
              id={`${idPrefix}-hostPort-${index}`}
              value={port.hostPort ?? ""}
              onChange={(event) =>
                updatePort(index, "hostPort", event.target.value)
              }
              placeholder="8080"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${idPrefix}-containerPort-${index}`}>
              Container Port
            </Label>
            <Input
              id={`${idPrefix}-containerPort-${index}`}
              value={port.containerPort ?? ""}
              onChange={(event) =>
                updatePort(index, "containerPort", event.target.value)
              }
              placeholder="80"
            />
          </div>
        </>
      )}
    />
  )
}