from fastapi import HTTPException
from src.database import Post
from bson.objectid import ObjectId


async def get_post_by_id(post_id: str):
    post = Post.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
    