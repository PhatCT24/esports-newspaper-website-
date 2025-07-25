from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError,jwt
from src.database import Post
from src.config import settings
from bson.objectid import ObjectId

async def valid_post_id(post_id: str) -> dict:
    post = Post.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(404, detail="Post not found")
    return post

async def parse_jwt_data(
    token : str = Depends(OAuth2PasswordBearer(tokenUrl="login"))
):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")
    return {"user_id": payload["id"]}

async def valid_owned_post(post: dict = Depends(valid_post_id), token_data: dict = Depends(parse_jwt_data)) -> dict:
    if post["user_id"] != token_data["user_id"]:
        raise HTTPException(status_code=403, detail="You are not the owner of this post")
    return post 