from pydantic import BaseModel
from datetime import datetime

class ContainerStatResponse(BaseModel) :
    container_id : str
    cpu_percent : float
    memory_mb : float
    memory_limit_mb: float 
    timestamp : datetime

    class Config:
        from_attributes = True
class ComposeRequest(BaseModel):
    yaml: str # 전체 yaml 문자
