import { useEffect, useMemo, useState } from "react"

// 대시보드에서 사용하는 UI 상태(activeTab, selectedContainer, activeMenu)를 관리하는 hook
export function useDashboardState(containers = []) {
  const [activeTab, setActiveTab] = useState("metrics")
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [activeMenu, setActiveMenu] = useState("dashboard")

  // 컨테이너 목록 변경 시 선택 상태를 동기화하고 fallback 처리
  useEffect(() => {
    if (containers.length === 0) {
      setSelectedContainer(null)
      return
    }

    if (!selectedContainer) {
      setSelectedContainer(containers[0])
      return
    }

    const selectedId =
      selectedContainer?.container_id ?? selectedContainer?.id ?? null

    const matchedContainer = containers.find((container) => {
      const containerId = container?.container_id ?? container?.id ?? null
      return containerId === selectedId
    })

    if (!matchedContainer) {
      setSelectedContainer(containers[0])
      return
    }

    if (matchedContainer !== selectedContainer) {
      setSelectedContainer(matchedContainer)
    }
  }, [containers, selectedContainer])

  // 현재 선택된 컨테이너의 ID 계산
  const selectedContainerId = useMemo(() => {
    return selectedContainer?.container_id ?? selectedContainer?.id ?? null
  }, [selectedContainer])

  return {
    activeTab,
    setActiveTab,
    activeMenu,
    setActiveMenu,
    selectedContainer,
    setSelectedContainer,
    selectedContainerId,
  }
}