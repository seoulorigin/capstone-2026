import { Button } from "@/components/ui/button"
import ComposeServiceFields from "@/features/compose/components/ComposeServiceFields"

const sampleOptions = {
  services: [
    {
      id: "service-1",
      serviceName: "frontend",
      image: "node:20-alpine",
      containerName: "frontend-container",
      ports: [
        {
          hostPort: "5173",
          containerPort: "5173",
        },
      ],
      environment: [
        {
          key: "VITE_API_URL",
          value: "http://localhost:8000",
        },
      ],
    },
    {
      id: "service-2",
      serviceName: "backend",
      image: "python:3.12-slim",
      containerName: "backend-container",
      ports: [
        {
          hostPort: "8000",
          containerPort: "8000",
        },
      ],
      environment: [
        {
          key: "PYTHONPATH",
          value: "/backend",
        },
      ],
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