from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from database import Base

class ComposeProject(Base):
    __tablename__ = "compose_projects"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    yaml_content = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, running, completed, failed
    owner_username = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<ComposeProject(name={self.project_name}, status={self.status})>"
