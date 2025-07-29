from fastapi import APIRouter, Depends
from src.posts.schemas import PostResponseSchema
from src.posts.schemas import PostUpdateSchema, CreatePostsSchema
from src.posts import service
from src.auth.dependencies import get_current_user

from typing import List
from fastapi import Query

router = APIRouter()


@router.get("/search", response_model=List[dict])
async def search_post_title(title: str = Query(..., min_length=1)):
    return service.search_post_title(title)

@router.put("/{post_id}", response_model=PostResponseSchema)
async def update_post(post_id: str, payload: PostUpdateSchema, current_user: dict = Depends(get_current_user)):
    return await service.update_post(post_id, payload)

@router.get("/{post_id}", response_model=PostResponseSchema)
async def get_post_by_id(post_id: str):
    return await service.get_post_by_id(post_id)


@router.get("/", response_model=List[PostResponseSchema])
async def get_all_posts():
    return await service.get_all_posts()

@router.get("/title/{title}", response_model=PostResponseSchema)
async def get_post_by_title(title: str):
    return await service.get_post_by_title(title)

@router.delete("/{post_id}")
async def delete_post(post_id: str, current_user: dict = Depends(get_current_user)):
    return await service.delete_post(post_id)

@router.post("/", response_model=PostResponseSchema)
async def create_post(payload: CreatePostsSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    return await service.create_post(payload, user_id)

@router.get("/category/{category}", response_model=PostResponseSchema)
async def get_post_by_category(category: str):
    return await service.get_post_by_category(category)
