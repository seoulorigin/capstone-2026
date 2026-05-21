import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ComposePortFields from "@/features/compose/components/ComposePortFields"
import ComposeEnvironmentFields from "@/features/compose/components/ComposeEnvironmentFields"

const sampleOptions = {
  serviceName: "app",
  image: "nginx:latest",
  containerName: "my-container",
  ports: [
    {
      hostPort: "8080",
      containerPort: "80",
    },
  ],
  environment: [
    {
      key: "NODE_ENV",
      value: "production",
    },
  ],
}

export default function ComposeOptionForm({ options, onChange }) {
  const updateField = (field, value) => {
    onChange({
      ...options,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
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

      <ComposePortFields
        ports={options.ports}
        onChange={(nextPorts) => updateField("ports", nextPorts)}
      />

      <ComposeEnvironmentFields
        environment={options.environment}
        onChange={(nextEnvironment) =>
          updateField("environment", nextEnvironment)
        }
      />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onChange(sampleOptions)}
      >
        샘플 값 채우기
      </Button>
    </div>
  )
}