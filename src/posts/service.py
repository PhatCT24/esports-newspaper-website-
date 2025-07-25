from fastapi import HTTPException
from src.database import Post
from bson.objectid import ObjectId
from src.posts.schemas import PostUpdateSchema, CreatePostsSchema
from datetime import datetime

from src.posts.models import postListEntity, postEntity


async def get_post_by_id(post_id: str):
    post = Post.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return postEntity(post)
    
async def get_all_posts():
    posts = Post.find()
    return postListEntity(posts) 

async def update_post(post_id: str, payload: PostUpdateSchema):
    update_data = {k: v for k, v in dict(payload).items() if v is not None}
    res = Post.update_one({"_id": ObjectId(post_id)}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(404, detail="Post not found")
    updated_post = Post.find_one({"_id": ObjectId(post_id)})
    return postEntity(updated_post)
    
    
async def delete_post(post_id: str):
    res = Post.delete_one({"_id": ObjectId(post_id)})
    if res.deleted_count == 0:
        raise HTTPException(404, detail="Post not found")
    return {"detail": "Post deleted"}

async def create_post(payload: CreatePostsSchema, user_id: str):
    new_post = dict(payload)
    new_post["user_id"] = user_id
    new_post["created_at"] = datetime.now()
    new_post["updated_at"] = datetime.now()
    
    inserted = Post.insert_one(new_post)
    created_post = Post.find_one({"_id": inserted.inserted_id})
    return postEntity(created_post)

async def get_post_by_title(title: str):
    post = Post.find_one({"title": title})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return postEntity(post)

    
    
    