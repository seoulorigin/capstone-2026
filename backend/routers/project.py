from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from database import get_db
from models.project import Project
from services.session import get_username_from_session

router = APIRouter()

# 응답용 스키마: created_at(ISO형식), description(null허용) 
class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    owner_username: str

    class Config:
        from_attributes = True

# 프로젝트 생성
@router.post("/", response_model=ProjectResponse)
async def create_project(
    name: str, 
    description: Optional[str] = None, 
    db: Session = Depends(get_db), 
    session_id: str = Cookie(None)
):
    username = get_username_from_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
        
    new_project = Project(name=name, description=description, owner_username=username)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

# 내 프로젝트 목록 조회
@router.get("/")
async def get_projects(db: Session = Depends(get_db), session_id: str = Cookie(None)):
    username = get_username_from_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
        
    projects = db.query(Project).filter(Project.owner_username == username).all()
    return {"projects": projects}

# 프로젝트 수정
@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int, 
    name: Optional[str] = None, 
    description: Optional[str] = None, 
    db: Session = Depends(get_db), 
    session_id: str = Cookie(None)
):
    username = get_username_from_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")

    project = db.query(Project).filter(Project.id == project_id, Project.owner_username == username).first()
    if not project:
        raise HTTPException(status_code=404, detail="프로젝트를 찾을 수 없습니다.")

    if name: project.name = name
    if description is not None: project.description = description
    
    db.commit()
    db.refresh(project)
    return project

# 프로젝트 삭제
@router.delete("/{project_id}")
async def delete_project(
    project_id: int, 
    db: Session = Depends(get_db), 
    session_id: str = Cookie(None)
):
    username = get_username_from_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")

    project = db.query(Project).filter(Project.id == project_id, Project.owner_username == username).first()
    if not project:
        raise HTTPException(status_code=404, detail="프로젝트를 찾을 수 없습니다.")

    db.delete(project)
    db.commit()
    return {"message": "success", "deleted_id": project_id}
