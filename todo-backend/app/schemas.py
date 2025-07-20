from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TodoBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=500, description="Todo text")
    completed: bool = Field(default=False, description="Completion status")
    due_date: Optional[datetime] = Field(None, description="Due date")
    priority: PriorityEnum = Field(default=PriorityEnum.medium, description="Priority level")
    parent_id: Optional[int] = Field(None, description="Parent todo ID for nested todos")

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1, max_length=500)
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    priority: Optional[PriorityEnum] = None
    parent_id: Optional[int] = None

class TodoResponse(TodoBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    children_count: int = 0

    class Config:
        from_attributes = True

class TodoNested(TodoResponse):
    children: List['TodoNested'] = []

    class Config:
        from_attributes = True

# Update forward reference
TodoNested.model_rebuild()

class TodoStats(BaseModel):
    total: int
    completed: int
    pending: int
    overdue: int
    by_priority: dict

class BulkDeleteRequest(BaseModel):
    ids: List[int] = Field(..., min_items=1, description="List of todo IDs to delete")

class ToggleCompletionRequest(BaseModel):
    completed: bool = Field(..., description="New completion status")

class MoveRequest(BaseModel):
    new_parent_id: Optional[int] = Field(None, description="New parent ID (null for root level)")

class AIGenerateSubtasksRequest(BaseModel):
    todo_id: int = Field(..., description="ID of the parent todo to generate subtasks for")
    max_subtasks: int = Field(default=5, ge=1, le=10, description="Maximum number of subtasks to generate")

class AIGenerateSubtasksResponse(BaseModel):
    parent_todo_id: int
    generated_subtasks: List[TodoResponse]
    message: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None