import { create } from "zustand"

// 로그인 사용자 정보 및 인증 상태 전역 관리
const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),
}))

export default useAuthStore