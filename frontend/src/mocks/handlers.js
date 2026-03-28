import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({
      message: "MSW is running",
    })
  }),
]