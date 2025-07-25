from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from bson.objectid import ObjectId
from fastapi import Response, status, HTTPException, Request
from datetime import datetime, timezone, timedelta

from src.database import User
from src.auth.models import userEntity, userResponseEntity
from src.auth import schemas, utils
from src.auth.utils import create_access_token, create_refresh_token
from src.config import settings
from src.auth.constants import OTP_EXPIRE_MINUTES


ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


#register
async def user_register(payload: schemas.CreateUserSchema):
    user = User.find_one({'email': payload.email.lower()})
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    if payload.password != payload.passwordConfirm:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

    payload.password = utils.hash_password(payload.password)
    del payload.passwordConfirm

    payload.role = 'user'
    payload.verified = False
    payload.email = payload.email.lower()
    payload.created_at = datetime.now(timezone.utc)
    payload.updated_at = payload.created_at


    result = User.insert_one(payload.model_dump())
    new_user = userResponseEntity(User.find_one({'_id': result.inserted_id}))
    return {"status": "success", "user": new_user}


#send-verification-code
async def send_verification_code(payload: schemas.SendVerificationCodeSchema):

    user = User.find_one({"email": payload.email.lower()})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    verification_code = utils.generate_otp()

    code_expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    User.update_one(
        {"_id": user["_id"]},
        {"$set": {"verification_code": verification_code, "code_expires_at": code_expires_at}}
    )
    utils.send_verification_email(user["email"], verification_code)
    return {"status": "success", "message": "Verification code sent to email."}


#verify-code
async def verify_code(payload: schemas.VerifyUserSchema):
    user = User.find_one({"email": payload.email.lower()})
    if not user:
        raise HTTPException(404, detail="User not found")
    
    # Inline verification code validation
    code_expires_at = user.get("code_expires_at")
    if not code_expires_at:
        User.delete_one({"_id": user["_id"]})
        raise HTTPException(status_code=400, detail="Verification code expired. Registration removed.")
    
    if code_expires_at.tzinfo is None:
        code_expires_at = code_expires_at.replace(tzinfo=timezone.utc)
    
    if code_expires_at < datetime.now(timezone.utc):
        User.delete_one({"_id": user["_id"]})
        raise HTTPException(status_code=400, detail="Verification code expired. Registration removed.")
    
    if payload.code != user.get("verification_code"):
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    User.update_one({"_id": user["_id"]}, {"$set": {"verified": True}, "$unset": {"verification_code": "", "code_expires_at": ""}})
    return {"status": "success", "message": "User verified successfully"}

#login
async def login(payload: schemas.LoginUserSchema, response: Response):
    db_user = User.find_one({"email": payload.email.lower()})
    if not db_user:
        raise HTTPException(status_code=404, detail="Incorrect email or password")
    user = userEntity(db_user)
    
    if not utils.verify_password(payload.password, user['password']):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
    refresh_token = create_refresh_token({"sub": str(user["id"]), "role": user["role"]})

    response.set_cookie('access_token', access_token, httponly=True)
    response.set_cookie('refresh_token', refresh_token, httponly=True)
    response.set_cookie('logged_in', 'True', httponly=False)

    return{'status': 'success', 'access_token': access_token}


#refresh_token
async def refresh_token(response: Response, request: Request):
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing refresh token')

    payload = utils.decode_token(refresh_token)

    if not payload or 'sub' not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid refresh token')

    user_id = payload['sub']
    user = userEntity(User.find_one({'_id': ObjectId(str(user_id))}))

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')

    access_token = utils.create_access_token({"sub": str(user["id"]), "role": user["role"]})
    response.set_cookie('access_token', access_token, httponly=True)
    response.set_cookie('logged_in', 'True', httponly=False)

    return {'access_token': access_token}

  
#logout 
async def logout(response: Response):
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    response.delete_cookie('logged_in')
    return {'status': 'success'}

#forgot_password
async def forgot_password(payload: schemas.ForgotPasswordSchema):
    user = User.find_one({'email': payload.email.lower()})

    if not user:
        raise HTTPException(400, "User does not exists")

    if payload.password != payload.passwordConfirm:
        raise HTTPException(400, detail="Passwords do not match")
    
    payload.password = utils.hash_password(payload.password)
    del payload.passwordConfirm

    User.update_one({'email': payload.email.lower()}, {'$set': {'password': payload.password, 'updated_at': datetime.now(timezone.utc)}})
    return {'status': 'success', 'message': 'Password reset successfully'}

