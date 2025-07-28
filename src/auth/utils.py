from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from src.config import settings

import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
import random
from src.auth.constants import OTP_LENGTH, OTP_EXPIRE_MINUTES

load_dotenv()
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


pwd_context = CryptContext(schemes=['bcrypt'], deprecated = 'auto')


ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRE_MINUTES = settings.REFRESH_TOKEN_EXPIRES_IN
SECRET_KEY = settings.JWT_PRIVATE_KEY 

def hash_password(password : str):
    return pwd_context.hash(password)

def verify_password(password : str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return f'Bearer {token}'


def create_refresh_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return f'Bearer {token}'

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None



pending_verifications = {}  

def generate_otp(length=OTP_LENGTH):
    return ''.join(random.choices('0123456789', k=length))

def set_verification_code(email):
    otp = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    pending_verifications[email] = {'otp': otp, 'expires_at': expires_at}
    return otp

def send_verification_email(to_email, otp):
    from_email = EMAIL_USER
    subject = "Verification Code"
    msg = MIMEText(f"Your verification code is: {otp}")
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(from_email, [to_email], msg.as_string())