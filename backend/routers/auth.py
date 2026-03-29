from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
async def login():
    # 여기에 PAM 인증 및 Redis 세션 저장 로직 작성
    return {"message": "Login API 뼈대"}

