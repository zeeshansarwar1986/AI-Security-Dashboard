from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    role: str = "operator" # admin, operator

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class CameraBase(SQLModel):
    name: str
    rtsp_url: str
    location: Optional[str] = None
    status: str = "offline" # online, offline

class Camera(CameraBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)

class PersonBase(SQLModel):
    name: str
    category: str # Employee, VIP, Blacklist, Visitor
    notes: Optional[str] = None

class Person(PersonBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    image_path: str
    created_at: datetime = Field(default_factory=datetime.now)

class FaceLogBase(SQLModel):
    camera_id: Optional[int] = Field(default=None, foreign_key="camera.id")
    person_id: Optional[int] = Field(default=None, foreign_key="person.id")
    confidence: float
    image_snapshot_path: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class FaceLog(FaceLogBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
class Alert(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str # Blacklist, Off-Hours, Unknown
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)
    is_resolved: bool = False
