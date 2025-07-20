from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func
from typing import List, Optional
from datetime import datetime, date
from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate

def get_todo(db: Session, todo_id: int) -> Optional[Todo]:
    """Get a single todo by ID"""
    return db.query(Todo).filter(Todo.id == todo_id).first()

def get_todo_with_children(db: Session, todo_id: int) -> Optional[Todo]:
    """Get a todo with all its nested children"""
    return db.query(Todo).options(joinedload(Todo.children)).filter(Todo.id == todo_id).first()

def get_todos(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    parent_id: Optional[int] = None,
    completed: Optional[bool] = None,
    priority: Optional[str] = None,
    user_id: Optional[int] = None
) -> List[Todo]:
    """Get todos with optional filtering"""
    query = db.query(Todo)
    
    if parent_id is not None:
        query = query.filter(Todo.parent_id == parent_id)
    elif parent_id is None and 'parent_id' in locals():
        # Get only root todos (no parent)
        query = query.filter(Todo.parent_id.is_(None))
    
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    
    if priority:
        query = query.filter(Todo.priority == priority)
    
    if user_id:
        query = query.filter(Todo.user_id == user_id)
    
    return query.offset(skip).limit(limit).all()

def get_root_todos_with_children(db: Session, skip: int = 0, limit: int = 100) -> List[Todo]:
    """Get all root todos with their nested children"""
    return db.query(Todo).options(joinedload(Todo.children)).filter(
        Todo.parent_id.is_(None)
    ).offset(skip).limit(limit).all()

def create_todo(db: Session, todo: TodoCreate) -> Todo:
    """Create a new todo"""
    db_todo = Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo_update: TodoUpdate) -> Optional[Todo]:
    """Update an existing todo"""
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        return None
    
    update_data = todo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int) -> bool:
    """Delete a todo and all its children (cascade)"""
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        return False
    
    db.delete(db_todo)
    db.commit()
    return True

def toggle_todo_completion(db: Session, todo_id: int, completed: bool) -> Optional[Todo]:
    """Toggle todo completion status"""
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        return None
    
    db_todo.completed = completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

def search_todos(db: Session, query: str, skip: int = 0, limit: int = 100) -> List[Todo]:
    """Search todos by text content"""
    return db.query(Todo).filter(
        Todo.text.ilike(f"%{query}%")
    ).offset(skip).limit(limit).all()

def get_todo_stats(db: Session, user_id: Optional[int] = None) -> dict:
    """Get todo statistics"""
    query = db.query(Todo)
    if user_id:
        query = query.filter(Todo.user_id == user_id)
    
    total = query.count()
    completed = query.filter(Todo.completed == True).count()
    pending = total - completed
    
    # Count overdue todos
    today = date.today()
    overdue = query.filter(
        and_(Todo.due_date < today, Todo.completed == False)
    ).count()
    
    # Count by priority
    priority_stats = {}
    for priority in ['low', 'medium', 'high']:
        priority_stats[priority] = query.filter(Todo.priority == priority).count()
    
    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "overdue": overdue,
        "by_priority": priority_stats
    }

def move_todo(db: Session, todo_id: int, new_parent_id: Optional[int]) -> Optional[Todo]:
    """Move a todo to a different parent"""
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        return None
    
    # Prevent circular references
    if new_parent_id and is_descendant(db, new_parent_id, todo_id):
        return None
    
    db_todo.parent_id = new_parent_id
    db.commit()
    db.refresh(db_todo)
    return db_todo

def is_descendant(db: Session, potential_parent_id: int, todo_id: int) -> bool:
    """Check if potential_parent_id is a descendant of todo_id (prevent circular refs)"""
    todo = db.query(Todo).filter(Todo.id == potential_parent_id).first()
    if not todo:
        return False
    
    if todo.parent_id == todo_id:
        return True
    
    if todo.parent_id:
        return is_descendant(db, todo.parent_id, todo_id)
    
    return False

def bulk_delete_todos(db: Session, todo_ids: List[int]) -> int:
    """Delete multiple todos by IDs"""
    deleted_count = db.query(Todo).filter(Todo.id.in_(todo_ids)).delete(synchronize_session=False)
    db.commit()
    return deleted_count