from fastapi import APIRouter
from src.posts.dependencies import valid_owned_post
from src.posts.models import PostResponseSchema
from src.posts.schemas import PostUpdateSchema
from src.posts import service

router = APIRouter()

@router.post("/user/{user_id}/posts/{post_id}", response_model=PostResponseSchema)
async def get_user_post(post: dict = Depends(valid_owned_post)):
    return post   

@router.put("/posts/{post_id}")
async def update_post(payload: PostUpdateSchema, post: dict = Depends(valid_owned_post)):
    return await service.update_post(payload, post)

@router.get("/posts/{post_id}", response_model=PostResponseSchema)
async def get_post(post: dict = Depends(valid_post_id)):
    return await service.get_post_by_id(post)