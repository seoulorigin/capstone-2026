from database import Base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    owner_username = Column(String, index=True) # PAM 인증 사용자명
    created_at = Column(DateTime, default=datetime.utcnow)

    
