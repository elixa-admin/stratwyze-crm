from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import os
from dotenv import load_dotenv
from logging_config import log_request, log_error, logger

from database import get_db, init_db, create_initial_stages
from models import User, Organization
from auth import hash_password, verify_password, create_access_token, verify_token, ACCESS_TOKEN_EXPIRE_MINUTES
from schemas import UserSignupRequest, UserLoginRequest, TokenResponse, UserResponse
from routes import router

load_dotenv()

app = FastAPI(title="Stratwyze CRM API", version="0.1.0")

# Include routers
app.include_router(router)

# Error handling middleware
@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        log_request(request.method, request.url.path, response.status_code)
        return response
    except Exception as exc:
        log_error("Unhandled exception", str(exc))
        return Response(
            content='{"detail": "Internal server error"}',
            status_code=500,
            media_type="application/json"
        )

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()
    create_initial_stages()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Auth Endpoints
@app.post("/api/auth/signup", response_model=TokenResponse)
async def signup(request: UserSignupRequest, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter_by(email=request.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if organization exists
    org = db.query(Organization).filter_by(id=request.organization_id).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization not found"
        )

    # Create user
    user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        first_name=request.first_name,
        last_name=request.last_name,
        organization_id=request.organization_id,
        role="agent"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate token
    access_token = create_access_token(
        user_id=str(user.id),
        email=user.email,
        role=user.role
    )

    response = Response(
        content='{"access_token": "' + access_token + '", "token_type": "bearer", "expires_in": ' + str(ACCESS_TOKEN_EXPIRE_MINUTES * 60) + '}',
        media_type="application/json"
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter_by(email=request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate token
    access_token = create_access_token(
        user_id=str(user.id),
        email=user.email,
        role=user.role
    )

    response = Response(
        content='{"access_token": "' + access_token + '", "token_type": "bearer", "expires_in": ' + str(ACCESS_TOKEN_EXPIRE_MINUTES * 60) + '}',
        media_type="application/json"
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@app.post("/api/auth/logout")
async def logout():
    response = Response(content='{"message": "logged out"}', media_type="application/json")
    response.delete_cookie(key="access_token")
    return {"message": "logged out"}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user(db: Session = Depends(get_db)):
    # In a real app, extract token from header or cookie
    # For now, this is a placeholder
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
