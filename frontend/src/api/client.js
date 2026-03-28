import axios from "axios"

// 세션 쿠키를 포함한 공통 API 요청을 처리하는 axios 인스턴스
export const api = axios.create({
  baseURL: "/",
  withCredentials: true,
})