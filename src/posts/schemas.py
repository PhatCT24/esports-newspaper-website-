from datetime import datetime 
from pydantic import BaseModel, Field
from typing import Literal, Optional


class PostsBaseSchema(BaseModel):
    title: str = Field(..., min_length = 10)
    category: str
    subcategory: str
    description: str
    content: str
    image: str
    user_id: str
    post_id:str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

class CreatePostsSchema(BaseModel):
    title: str = Field(..., min_length=10)
    category: str
    subcategory: str
    description: str
    content: str
    image: str
    
    class Config:
        from_attributes = True


class PostUpdateSchema(PostsBaseSchema):
    title: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None


class PostResponseSchema(BaseModel):
    post_id: str
    title: str
    category: str
    subcategory: str
    description: str
    content: str
    image: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True