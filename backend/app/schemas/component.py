from pydantic import BaseModel
from typing import Optional


class ComponentBase(BaseModel):
    name:str 
    slug:str
    description:Optional[str] =None
    status:str = "draft"


class ComponentCreate(ComponentBase):
    pass

class ComponentResponse(ComponentBase):
    id:int
    
    class Config:
        from_attributes =True