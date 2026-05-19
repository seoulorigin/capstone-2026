from pydantic import BaseModel
from datetime import datetime

class ComposeUpRequest(BaseModel):
    yaml: str

class ComposeUpResponse(BaseModel):
    project_id: int
    message: str

class ComposeEventResponse(BaseModel):
    type: str  # log, status, error, completed
    message: str
    timestamp: datetime
