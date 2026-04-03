import { create } from "zustand"

const useContainerStore = create((set) => ({
    containerStats: {}, // { containerId: data }

    // 특정 컨테이너의 최신 스탯을 저장하는 함수
    setContainerStats: (containerId, data) =>
        set((state) => ({
            containerStats: {
                ...state.containerStats,
                [containerId]: data,
            },
        })),
}))

export default useContainerStore