// 날짜 포맷 관련 유틸 함수 모음

// API에서 받은 created_at 값을 화면용 날짜 문자열로 변환
export function formatCreatedAt(createdAt) {
  if (!createdAt) return "-"

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return createdAt
  }

  return date.toLocaleDateString("ko-KR")
}

// API에서 받은 updated_at 값을 화면용 날짜/시간 문자열로 변환
export function formatUpdatedAt(updatedAt) {
  if (!updatedAt) return "-"

  const date = new Date(updatedAt)

  if (Number.isNaN(date.getTime())) {
    return updatedAt
  }

  return date.toLocaleString("ko-KR")
}