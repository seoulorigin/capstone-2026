import { Button } from "@/components/ui/button"
import ComposeServiceFields from "@/features/compose/components/ComposeServiceFields"

const sampleOptions = {
  services: [
    {
      id: "service-1",
      serviceName: "test-nginx-1",
      image: "nginx:latest",
      containerName: "",
      ports: [
        {
          hostPort: "18080",
          containerPort: "80",
        },
      ],
      environment: [
        {
          key: "TEST_MODE",
          value: "compose-nginx-1",
        },
      ],
      optionalFields: {
        restart: "unless-stopped",
        labels: ["app=compose-test", "role=web"],
      },
    },
    {
      id: "service-2",
      serviceName: "test-worker-1",
      image: "alpine:latest",
      containerName: "",
      ports: [],
      environment: [
        {
          key: "TEST_MODE",
          value: "compose-worker-1",
        },
      ],
      optionalFields: {
        command:
          "sh -c \"while true; do echo '[worker-1] compose multi-service test running'; sleep 3; done\"",
        restart: "unless-stopped",
        labels: ["app=compose-test", "role=worker"],
      },
    },
  ],
}

function createEmptyService(index) {
  return {
    id: `service-${Date.now()}-${index}`,
    serviceName: `service-${index}`,
    image: "",
    containerName: "",
    ports: [],
    environment: [],
  }
}

function normalizeServices(services) {
  return Array.isArray(services) ? services : []
}

export default function ComposeOptionForm({ options, onChange }) {
  const services = normalizeServices(options.services)

  const updateServices = (nextServices) => {
    onChange({
      ...options,
      services: nextServices,
    })
  }

  const updateService = (index, nextService) => {
    const nextServices = services.map((service, serviceIndex) => {
      if (serviceIndex !== index) return service

      return nextService
    })

    updateServices(nextServices)
  }

  const addService = () => {
    updateServices([...services, createEmptyService(services.length + 1)])
  }

  const removeService = (index) => {
    if (services.length <= 1) {
      return
    }

    const nextServices = services.filter((_, serviceIndex) => {
      return serviceIndex !== index
    })

    updateServices(nextServices)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-200">Services</h3>
        </div>

        <Button type="button" variant="outline" onClick={addService}>
          서비스 추가
        </Button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <ComposeServiceFields
            key={service.id || `service-${index}`}
            service={service}
            serviceIndex={index}
            canRemove={services.length > 1}
            onChange={(nextService) => updateService(index, nextService)}
            onRemove={() => removeService(index)}
          />
        ))}
      </div>

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