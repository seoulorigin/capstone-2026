from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from backend.database import Base

class Container(Base):
    __tablename__ = "containers"

    # 1. 고유 식별자 (DB 관리용)
    id = Column(Integer, primary_key=True, index=True)
    
    # 2. 실제 도커 엔진에서 부여하는 64자리 고유 ID
    container_id = Column(String, unique=True, index=True, nullable=False)
    
    # 3. 컨테이너 이름 (예: my_web_app)
    name = Column(String, nullable=False)
    
    # 4. 사용된 이미지 이름 (예: nginx:latest, python:3.9)
    image = Column(String, nullable=False)
    
    # 5. 상태 (예: running, exited, paused, restarting)
    status = Column(String)
    
    # 6. 포트 바인딩 정보 (예: "80:80/tcp")
    ports = Column(String, nullable=True)
    
    # 7. DB 기록 생성 시간
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Container(name={self.name}, status={self.status})>"
