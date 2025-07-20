from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Body, Form
from fastapi.responses import FileResponse
import os
import base64

router = APIRouter(prefix="/api/admin", tags=["admin"])

# 管理员 Token，可通过环境变量 ADMIN_TOKEN 设置，默认值更安全
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "YWRtaW4xMjM=")
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../todos.db"))

@router.post("/verify")
async def verify_password(payload: dict = Body(...)):
    token = payload.get("token", "")
    if token == ADMIN_TOKEN:
        return {"success": True, "message": "Token correct."}
    return {"success": False, "message": "Incorrect token."}

@router.get("/db")
async def download_db(token: str):
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=404, detail="Database file not found")
    return FileResponse(DB_PATH, filename="todos.db", media_type="application/octet-stream")

@router.post("/db")
async def upload_db(token: str = Form(...), file: UploadFile = File(...)):
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")
    if file.content_type != "application/octet-stream":
        raise HTTPException(status_code=400, detail="Invalid file type")
    try:
        contents = await file.read()
        with open(DB_PATH, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    return {"message": "Database uploaded successfully"}
