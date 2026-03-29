import redis
import uuid

# Redis 연결 설정 (상위 폴더 venv에서 실행되므로 경로 문제 없음)
rd = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def create_session(username: str) -> str:
    """로그인 성공 시 호출: 세션 ID 생성 및 Redis 저장 (유효시간 1시간)"""
    session_id = str(uuid.uuid4())
    rd.setex(session_id, 3600, username)
    return session_id

def get_username_from_session(session_id: str) -> str:
    """세션 ID로 사용자 이름 조회: 없으면 None 반환"""
    if not session_id:
        return None
    return rd.get(session_id)

def delete_session(session_id: str):
    """로그아웃 시 호출: Redis에서 세션 삭제"""
    rd.delete(session_id)
