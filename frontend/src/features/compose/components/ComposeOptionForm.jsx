import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ComposeOptionForm({ options, onChange }) {
  const updateField = (field, value) => {
    onChange({
      ...options,
      [field]: value,
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="serviceName">Service Name</Label>
        <Input
          id="serviceName"
          value={options.serviceName}
          onChange={(event) => updateField("serviceName", event.target.value)}
          placeholder="app"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          value={options.image}
          onChange={(event) => updateField("image", event.target.value)}
          placeholder="nginx:latest"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="containerName">Container Name</Label>
        <Input
          id="containerName"
          value={options.containerName}
          onChange={(event) => updateField("containerName", event.target.value)}
          placeholder="my-container"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="hostPort">Host Port</Label>
        <Input
          id="hostPort"
          value={options.hostPort}
          onChange={(event) => updateField("hostPort", event.target.value)}
          placeholder="8080"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="containerPort">Container Port</Label>
        <Input
          id="containerPort"
          value={options.containerPort}
          onChange={(event) => updateField("containerPort", event.target.value)}
          placeholder="80"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="environmentKey">Environment Key</Label>
        <Input
          id="environmentKey"
          value={options.environmentKey}
          onChange={(event) =>
            updateField("environmentKey", event.target.value)
          }
          placeholder="NODE_ENV"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="environmentValue">Environment Value</Label>
        <Input
          id="environmentValue"
          value={options.environmentValue}
          onChange={(event) =>
            updateField("environmentValue", event.target.value)
          }
          placeholder="production"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() =>
          onChange({
            serviceName: "app",
            image: "nginx:latest",
            containerName: "my-container",
            hostPort: "8080",
            containerPort: "80",
            environmentKey: "NODE_ENV",
            environmentValue: "production",
          })
        }
      >
        샘플 값 채우기
      </Button>
    </div>
  )
}