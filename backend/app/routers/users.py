from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.models import User
from app.schemas import UserLogin, UserRegistration, UserResponse
from app.auth import (
    get_password_hash, verify_password, create_access_token, get_current_user
)

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=UserResponse)
def register_user(payload: UserRegistration, db: Session = Depends(get_db)):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        is_admin=False,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive account")

    token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=token_expires)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_admin": user.is_admin,
    }

@router.post("/refresh")
def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh an access token"""
    access_token = create_access_token(data={"sub": str(current_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
