from fastapi import Depends, HTTPException, Request, status
from src.auth.utils import decode_token
from src.database import User
from src.auth.models import userEntity
from src.auth.schemas import LoginUserSchema

def get_current_user(payload: LoginUserSchema = Depends(LoginUserSchema)):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(401, detail="Not authenticated")
    payload = decode_token(access_token)
    if not payload or 'sub' not in payload:
        raise HTTPException(401, detail="Invalid token")
    user = user.find_one({"_id": ObjectId(payload['sub'])})
    if not user:
        raise HTTPException(401, detail="User not found")
    return userEntity(user)

def require_role(role: str):
    def dependency(user = Depends(get_current_user)):
        if user["role"] != role:
            raise HTTPException(403, detail="Unauthorized")
        return user 
    return dependency
    