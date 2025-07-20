from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    due_date = Column(DateTime, nullable=True)
    priority = Column(String(10), default="medium", nullable=False)
    parent_id = Column(Integer, ForeignKey("todos.id"), nullable=True)
    user_id = Column(Integer, nullable=True)  # For future user support
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Self-referential relationship for nested todos
    parent = relationship("Todo", remote_side=[id], back_populates="children")
    children = relationship("Todo", back_populates="parent", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Todo(id={self.id}, text='{self.text}', completed={self.completed})>"