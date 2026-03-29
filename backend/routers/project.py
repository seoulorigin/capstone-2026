from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.project import Project

router = APIRouter()

@router.get("/")
def get_projects(db: Session = Depends(get_db)):
    # DB에서 프로젝트 목록을 가져와서 반환한다
    projects = db.query(Projects).all()
    return {"projects":projects}
