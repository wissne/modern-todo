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

def generate_ai_subtasks(db: Session, parent_todo_id: int, max_subtasks: int = 5) -> List[Todo]:
    """Generate AI subtasks for a given parent todo (mock implementation)"""
    parent_todo = get_todo(db, parent_todo_id)
    if not parent_todo:
        return []
    
    # Mock AI analysis based on todo text
    todo_text = parent_todo.text.lower()
    
    # Define mock subtask templates based on common todo patterns
    subtask_templates = {
        'project': [
            "Research and gather requirements",
            "Create project plan and timeline", 
            "Set up development environment",
            "Implement core functionality",
            "Test and debug",
            "Document the project",
            "Deploy and launch"
        ],
        'meeting': [
            "Prepare agenda",
            "Send calendar invites",
            "Book meeting room",
            "Prepare presentation materials",
            "Follow up with attendees",
            "Document meeting notes"
        ],
        'travel': [
            "Book flights",
            "Reserve accommodation", 
            "Plan itinerary",
            "Pack luggage",
            "Check travel documents",
            "Arrange transportation"
        ],
        'shopping': [
            "Make shopping list",
            "Compare prices online",
            "Check store hours",
            "Visit stores",
            "Compare products",
            "Make purchase"
        ],
        'study': [
            "Gather study materials",
            "Create study schedule",
            "Review notes",
            "Practice exercises",
            "Take practice tests",
            "Review weak areas"
        ],
        'cooking': [
            "Plan menu",
            "Make grocery list",
            "Buy ingredients",
            "Prep ingredients",
            "Cook meal",
            "Clean up"
        ],
        'exercise': [
            "Plan workout routine",
            "Warm up",
            "Cardio exercise",
            "Strength training",
            "Cool down and stretch",
            "Track progress"
        ]
    }
    
    # Default generic subtasks
    generic_subtasks = [
        "Break down into smaller steps",
        "Research and gather information",
        "Create action plan",
        "Execute first phase",
        "Review and adjust approach",
        "Complete final steps",
        "Review and finalize"
    ]
    
    # Determine which template to use based on keywords
    selected_subtasks = generic_subtasks
    for category, subtasks in subtask_templates.items():
        if any(keyword in todo_text for keyword in [category, category[:-1] if category.endswith('ing') else category + 'ing']):
            selected_subtasks = subtasks
            break
    
    # Additional keyword matching
    if any(word in todo_text for word in ['plan', 'organize', 'prepare']):
        selected_subtasks = subtask_templates['project']
    elif any(word in todo_text for word in ['buy', 'purchase', 'get']):
        selected_subtasks = subtask_templates['shopping']
    elif any(word in todo_text for word in ['learn', 'study', 'read']):
        selected_subtasks = subtask_templates['study']
    elif any(word in todo_text for word in ['workout', 'gym', 'fitness']):
        selected_subtasks = subtask_templates['exercise']
    
    # Limit to max_subtasks and create todo objects
    import random
    selected_subtasks = selected_subtasks[:max_subtasks]
    if len(selected_subtasks) > max_subtasks:
        selected_subtasks = random.sample(selected_subtasks, max_subtasks)
    
    created_subtasks = []
    for i, subtask_text in enumerate(selected_subtasks):
        subtask = Todo(
            text=subtask_text,
            completed=False,
            priority=parent_todo.priority,  # Inherit priority from parent
            parent_id=parent_todo_id,
            user_id=parent_todo.user_id
        )
        db.add(subtask)
        created_subtasks.append(subtask)
    
    db.commit()
    
    # Refresh all created subtasks
    for subtask in created_subtasks:
        db.refresh(subtask)
    
    return created_subtasks