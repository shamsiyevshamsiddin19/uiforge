from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base

class Component(Base):
    __tablename__ = "components"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    slug = Column(String(50), index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="draft")
