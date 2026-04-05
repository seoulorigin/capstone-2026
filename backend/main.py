from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, project, container

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5173",
        "http://52.78.113.234:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(project.router, prefix="/projects", tags=["projects"])
app.include_router(container.router, prefix="/containers")

@app.get("/")
async def root():
    return {"message": "Capstone API Server is running"}
def read_root():
    return {"message": "Capstone 2026 API Server is running"}


