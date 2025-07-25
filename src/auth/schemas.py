from datetime import datetime
from pydantic import BaseModel, EmailStr, constr, Field
from typing import Literal, Optional


class UserBaseSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    photo: str | None = None
    role: Optional[Literal["admin", "user", "guest"]] = "user"
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class CreateUserSchema(UserBaseSchema):
    password: constr(min_length=8)
    passwordConfirm: constr(min_length=8)
    verified: bool = False
    verification_code: Optional[str] = None
    code_expires_at: Optional[datetime] = None


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class UserResponseSchema(UserBaseSchema):
    id: str
    pass


class UserResponse(BaseModel):
    status: str
    user: UserResponseSchema

class SendVerificationCodeSchema(BaseModel):
    email: EmailStr

class VerifyUserSchema(BaseModel):
    email: EmailStr
    code: str

class ForgotPasswordSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    passwordConfirm: constr(min_length=8)