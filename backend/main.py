from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, project, container


app = FastAPI()

origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:5173",  # 추가
    "http://127.0.0.1:8000",  # 추가
    "http://52.78.113.234:5173",
    "http://52.78.113.234:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # 웹소켓이나 긴 요청을 위해 브라우저가 CORS 정보를 캐시하도록 설정
    max_age=3600, 
)

    
# 라우터 등록
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(project.router, prefix="/projects", tags=["projects"])
app.include_router(container.router, prefix="/container", tags=["container"])


@app.get("/")
def read_root():
    return {"message": "Capstone 2026 API Server is running"}


