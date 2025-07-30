
from fastapi import APIRouter, Response, Request, Depends
from src.auth import schemas
from src.auth import service
from src.auth.dependencies import get_current_user

router = APIRouter()

@router.post('/register',response_model=schemas.UserResponse)
async def user_register(payload: schemas.CreateUserSchema):
    return await service.user_register(payload)

@router.post('/send-verification-code')
async def send_verification_code(payload: schemas.SendVerificationCodeSchema):
    return await service.send_verification_code(payload)

@router.post('/verify-code')
async def verify_code(payload: schemas.VerifyUserSchema):
    return await service.verify_code(payload)

@router.post('/login')
async def login(payload: schemas.LoginUserSchema, response: Response):
    return await service.login(payload, response)

@router.get('/refresh')
async def refresh_token(response: Response, request: Request):
    return await service.refresh_token(response, request)

@router.post('/logout')
async def logout(response: Response):
    return await service.logout(response)

@router.get('/forgot-password')
async def forgot_password(payload: schemas.ForgotPasswordSchema):
    return await service.forgot_password(payload)

@router.get('/user/me', response_model=schemas.GetUserByIdSchema)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return await service.get_user_by_id(current_user["id"])