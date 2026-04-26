from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ContainerStatResponse(BaseModel) :
    id: str
    name: str
    statis: str
    cpu_percent : float
    memory_usage_mb : float
    memory_limit_mb: float
    memory_percent: float 
    timestamp : Optional[datetime] = None 

    class Config:
        from_attributes = True
