from pydantic import BaseModel
from datetime import datetime

class ComposeDeployRequest(BaseModel):
    yaml: str

class ComposeDeployResponse(BaseModel):
    message: str

class ContainerStatResponse(BaseModel) :
    container_id : str
    cpu_percent : float
    memory_mb : float
    memory_limit_mb: float 
    timestamp : datetime

    class Config:
        from_attributes = True
