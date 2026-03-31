from fastapi import APIRouter, HTTPException, Response, Cookie
from pydantic import BaseModel
from backend.services.session import create_session, delete_session

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(request: LoginRequest, response: Response):
    # TODO: 추후 Linux PAM 인증 로직(p.authenticate) 연결 예정
    # 현재는 모든 로그인을 성공으로 가정하고 세션을 생성합니다.
    session_id = create_session(request.username)
    
    # 프론트엔드와 협의한 쿠키 기반 인증 설정
    response.set_cookie(
        key="session_id", 
        value=session_id, 
        httponly=True,   # 보안 설정
        samesite="lax"   # CORS 환경 쿠키 전달 설정
    )
    
    # 프론트엔드 요청 응답 양식 반영
    return {
        "data": {
            "user": request.username
        }
    }

@router.post("/logout")
async def logout(response: Response, session_id: str = Cookie(None)):
    if session_id:
        delete_session(session_id)
    response.delete_cookie("session_id")
    return {"message": "success"}
