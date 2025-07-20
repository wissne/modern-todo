from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import crud, schemas
from app.models import Todo

router = APIRouter(prefix="/api/todos", tags=["todos"])

def build_nested_response(todo: Todo) -> schemas.TodoNested:
    """Convert Todo model to nested response schema"""
    children = [build_nested_response(child) for child in todo.children]
    return schemas.TodoNested(
        id=todo.id,
        text=todo.text,
        completed=todo.completed,
        due_date=todo.due_date,
        priority=todo.priority,
        parent_id=todo.parent_id,
        user_id=todo.user_id,
        created_at=todo.created_at,
        updated_at=todo.updated_at,
        children_count=len(children),
        children=children
    )

@router.get("/", response_model=List[schemas.TodoNested])
def get_todos(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    parent_id: Optional[int] = Query(None, description="Filter by parent ID (null for root todos)"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    nested: bool = Query(True, description="Return nested structure"),
    db: Session = Depends(get_db)
):
    """Get all todos with optional filtering"""
    if nested and parent_id is None:
        # Get root todos with nested children
        todos = crud.get_root_todos_with_children(db, skip=skip, limit=limit)
        return [build_nested_response(todo) for todo in todos]
    else:
        # Get flat list of todos
        todos = crud.get_todos(
            db, skip=skip, limit=limit, parent_id=parent_id, 
            completed=completed, priority=priority
        )
        return [schemas.TodoNested(
            id=todo.id,
            text=todo.text,
            completed=todo.completed,
            due_date=todo.due_date,
            priority=todo.priority,
            parent_id=todo.parent_id,
            user_id=todo.user_id,
            created_at=todo.created_at,
            updated_at=todo.updated_at,
            children_count=len(todo.children),
            children=[]
        ) for todo in todos]

@router.get("/{todo_id}", response_model=schemas.TodoNested)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    """Get a specific todo with its nested children"""
    todo = crud.get_todo_with_children(db, todo_id=todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return build_nested_response(todo)

@router.post("/", response_model=schemas.TodoResponse, status_code=201)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    """Create a new todo"""
    # Validate parent exists if parent_id is provided
    if todo.parent_id:
        parent = crud.get_todo(db, todo.parent_id)
        if not parent:
            raise HTTPException(status_code=400, detail="Parent todo not found")
    
    db_todo = crud.create_todo(db=db, todo=todo)
    return schemas.TodoResponse(
        id=db_todo.id,
        text=db_todo.text,
        completed=db_todo.completed,
        due_date=db_todo.due_date,
        priority=db_todo.priority,
        parent_id=db_todo.parent_id,
        user_id=db_todo.user_id,
        created_at=db_todo.created_at,
        updated_at=db_todo.updated_at,
        children_count=len(db_todo.children)
    )

@router.put("/{todo_id}", response_model=schemas.TodoResponse)
def update_todo(todo_id: int, todo_update: schemas.TodoUpdate, db: Session = Depends(get_db)):
    """Update an existing todo"""
    # Validate parent exists if parent_id is being updated
    if todo_update.parent_id is not None:
        parent = crud.get_todo(db, todo_update.parent_id)
        if not parent:
            raise HTTPException(status_code=400, detail="Parent todo not found")
        
        # Prevent circular references
        if crud.is_descendant(db, todo_update.parent_id, todo_id):
            raise HTTPException(status_code=400, detail="Cannot move todo to its own descendant")
    
    db_todo = crud.update_todo(db=db, todo_id=todo_id, todo_update=todo_update)
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return schemas.TodoResponse(
        id=db_todo.id,
        text=db_todo.text,
        completed=db_todo.completed,
        due_date=db_todo.due_date,
        priority=db_todo.priority,
        parent_id=db_todo.parent_id,
        user_id=db_todo.user_id,
        created_at=db_todo.created_at,
        updated_at=db_todo.updated_at,
        children_count=len(db_todo.children)
    )

@router.delete("/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Delete a todo and all its children"""
    success = crud.delete_todo(db=db, todo_id=todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}

@router.patch("/{todo_id}/toggle", response_model=schemas.TodoResponse)
def toggle_todo_completion(
    todo_id: int, 
    toggle_request: schemas.ToggleCompletionRequest,
    db: Session = Depends(get_db)
):
    """Toggle todo completion status"""
    db_todo = crud.toggle_todo_completion(db=db, todo_id=todo_id, completed=toggle_request.completed)
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return schemas.TodoResponse(
        id=db_todo.id,
        text=db_todo.text,
        completed=db_todo.completed,
        due_date=db_todo.due_date,
        priority=db_todo.priority,
        parent_id=db_todo.parent_id,
        user_id=db_todo.user_id,
        created_at=db_todo.created_at,
        updated_at=db_todo.updated_at,
        children_count=len(db_todo.children)
    )

@router.get("/{todo_id}/children", response_model=List[schemas.TodoResponse])
def get_todo_children(todo_id: int, db: Session = Depends(get_db)):
    """Get all direct children of a todo"""
    parent = crud.get_todo(db, todo_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent todo not found")
    
    children = crud.get_todos(db, parent_id=todo_id)
    return [schemas.TodoResponse(
        id=child.id,
        text=child.text,
        completed=child.completed,
        due_date=child.due_date,
        priority=child.priority,
        parent_id=child.parent_id,
        user_id=child.user_id,
        created_at=child.created_at,
        updated_at=child.updated_at,
        children_count=len(child.children)
    ) for child in children]

@router.post("/{todo_id}/move", response_model=schemas.TodoResponse)
def move_todo(
    todo_id: int,
    move_request: schemas.MoveRequest,
    db: Session = Depends(get_db)
):
    """Move a todo to a different parent"""
    # Validate new parent exists if provided
    if move_request.new_parent_id:
        parent = crud.get_todo(db, move_request.new_parent_id)
        if not parent:
            raise HTTPException(status_code=400, detail="New parent todo not found")
    
    db_todo = crud.move_todo(db=db, todo_id=todo_id, new_parent_id=move_request.new_parent_id)
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found or circular reference detected")
    
    return schemas.TodoResponse(
        id=db_todo.id,
        text=db_todo.text,
        completed=db_todo.completed,
        due_date=db_todo.due_date,
        priority=db_todo.priority,
        parent_id=db_todo.parent_id,
        user_id=db_todo.user_id,
        created_at=db_todo.created_at,
        updated_at=db_todo.updated_at,
        children_count=len(db_todo.children)
    )

@router.get("/search/", response_model=List[schemas.TodoResponse])
def search_todos(
    q: str = Query(..., min_length=1, description="Search query"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Search todos by text content"""
    todos = crud.search_todos(db, query=q, skip=skip, limit=limit)
    return [schemas.TodoResponse(
        id=todo.id,
        text=todo.text,
        completed=todo.completed,
        due_date=todo.due_date,
        priority=todo.priority,
        parent_id=todo.parent_id,
        user_id=todo.user_id,
        created_at=todo.created_at,
        updated_at=todo.updated_at,
        children_count=len(todo.children)
    ) for todo in todos]

@router.get("/stats/", response_model=schemas.TodoStats)
def get_todo_stats(db: Session = Depends(get_db)):
    """Get todo statistics"""
    stats = crud.get_todo_stats(db)
    return schemas.TodoStats(**stats)

@router.delete("/bulk/", response_model=dict)
def bulk_delete_todos(
    delete_request: schemas.BulkDeleteRequest,
    db: Session = Depends(get_db)
):
    """Delete multiple todos by IDs"""
    deleted_count = crud.bulk_delete_todos(db, delete_request.ids)
    return {"message": f"Deleted {deleted_count} todos", "deleted_count": deleted_count}

@router.post("/{todo_id}/ai-subtasks", response_model=schemas.AIGenerateSubtasksResponse)
def generate_ai_subtasks(
    todo_id: int,
    max_subtasks: int = Query(default=5, ge=1, le=10, description="Maximum number of subtasks to generate"),
    db: Session = Depends(get_db)
):
    """Generate AI subtasks for a todo using mock AI analysis"""
    # Check if parent todo exists
    parent_todo = crud.get_todo(db, todo_id)
    if not parent_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Generate subtasks using mock AI
    generated_subtasks = crud.generate_ai_subtasks(db, todo_id, max_subtasks)
    
    # Convert to response format
    subtask_responses = [
        schemas.TodoResponse(
            id=subtask.id,
            text=subtask.text,
            completed=subtask.completed,
            due_date=subtask.due_date,
            priority=subtask.priority,
            parent_id=subtask.parent_id,
            user_id=subtask.user_id,
            created_at=subtask.created_at,
            updated_at=subtask.updated_at,
            children_count=len(subtask.children)
        ) for subtask in generated_subtasks
    ]
    
    return schemas.AIGenerateSubtasksResponse(
        parent_todo_id=todo_id,
        generated_subtasks=subtask_responses,
        message=f"Generated {len(generated_subtasks)} AI subtasks for '{parent_todo.text}'"
    )