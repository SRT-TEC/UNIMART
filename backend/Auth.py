from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from collections import defaultdict
from email.message import EmailMessage
import logging
import secrets
import smtplib
import os

from app.db.session import get_db
from app.model.user import User
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger(__name__)


failed_attempts = defaultdict(list)
MAX_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15


verification_tokens = {}  # {token: {"email": str, "expires": datetime, "type": "link"|"otp"}}
otp_codes = {}  # {email: {"code": str, "expires": datetime, "attempts": int}}
MAX_OTP_ATTEMPTS = 3
OTP_EXPIRY_MINUTES = 10
VERIFICATION_TOKEN_EXPIRY_HOURS = 24


SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USERNAME)
SMTP_USE_STARTTLS = os.getenv("SMTP_USE_STARTTLS", "true").lower() in {
    "1",
    "true",
    "yes",
}
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8081").rstrip("/")

def is_account_locked(email: str) -> bool:
    """Check if account is locked due to too many failed attempts."""
    now = datetime.utcnow()
    cutoff_time = now - timedelta(minutes=LOCKOUT_DURATION_MINUTES)


    failed_attempts[email] = [
        attempt_time for attempt_time in failed_attempts[email]
        if attempt_time > cutoff_time
    ]

    return len(failed_attempts[email]) >= MAX_ATTEMPTS

def record_failed_attempt(email: str):
    """Record a failed login attempt for rate limiting."""
    failed_attempts[email].append(datetime.utcnow())

def clear_failed_attempts(email: str):
    """Clear failed attempts on successful login."""
    if email in failed_attempts:
        del failed_attempts[email]

def send_email(recipient: str, subject: str, body: str, html_body: str = None) -> bool:
    """Send email through the configured SMTP server."""
    if not SMTP_HOST or not SMTP_FROM_EMAIL:
        logger.error("Email delivery is not configured: set SMTP_HOST and SMTP_FROM_EMAIL.")
        return False
    if bool(SMTP_USERNAME) != bool(SMTP_PASSWORD):
        logger.error("Email delivery requires both SMTP_USERNAME and SMTP_PASSWORD.")
        return False
    if SMTP_USERNAME and not SMTP_USE_STARTTLS:
        logger.error("Authenticated email delivery requires SMTP_USE_STARTTLS=true.")
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = SMTP_FROM_EMAIL
    message["To"] = recipient
    message.set_content(body)
    if html_body:
        message.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            if SMTP_USE_STARTTLS:
                server.starttls()
            if SMTP_USERNAME:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
        return True
    except (OSError, smtplib.SMTPException):
        logger.exception("Failed to send email through the configured SMTP server.")
        return False

def generate_verification_token() -> str:
    """Generate a secure verification token."""
    return secrets.token_urlsafe(32)

def generate_otp() -> str:
    """Generate a 6-digit OTP code."""
    return "".join([str(secrets.randbelow(10)) for _ in range(6)])

def send_verification_email(email: str, token: str):
    """Send verification link email."""
    verification_link = f"{FRONTEND_URL}/verify-email?token={token}"
    subject = "Verify Your Email - UNIMART"
    body = f"Click the link below to verify your email:\n{verification_link}\n\nThis link expires in 24 hours."
    html_body = f"""
    <html>
        <body>
            <h2>Verify Your Email</h2>
            <p>Click the button below to verify your email:</p>
            <a href="{verification_link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>Or copy this link: {verification_link}</p>
            <p>This link expires in 24 hours.</p>
        </body>
    </html>
    """
    return send_email(email, subject, body, html_body)

def send_otp_email(email: str, otp: str):
    """Send OTP code email."""
    subject = "Your UNIMART Verification Code"
    body = f"Your verification code is: {otp}\n\nThis code expires in 10 minutes. Do not share this code with anyone."
    html_body = f"""
    <html>
        <body>
            <h2>Verification Code</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 5px; font-family: monospace;">{otp}</h1>
            <p>This code expires in 10 minutes.</p>
            <p><strong>Do not share this code with anyone.</strong></p>
        </body>
    </html>
    """
    return send_email(email, subject, body, html_body)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """Register a new student with a school email."""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        phone=payload.phone,
        is_verified=False,  # Not verified until email confirmation
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate and send verification token
    token = generate_verification_token()
    verification_tokens[token] = {
        "email": payload.email,
        "expires": datetime.utcnow() + timedelta(hours=VERIFICATION_TOKEN_EXPIRY_HOURS),
        "type": "link"
    }
    if not send_verification_email(payload.email, token):
        del verification_tokens[token]
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Account created, but the verification email could not be sent. "
                "Check SMTP settings and request a new verification email."
            ),
        )

    return user

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Login and receive a jwt access token."""
    # Check if account is locked due to too many failed attempts
    if is_account_locked(payload.email):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Account locked due to too many failed attempts. Try again in {LOCKOUT_DURATION_MINUTES} minutes.",
        )

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        record_failed_attempt(payload.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email to login.",
        )
    if not getattr(user, "is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    # Clear failed attempts on successful login
    clear_failed_attempts(payload.email)

    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/verify-email/link")
def verify_email_with_link(token: str, db: Session = Depends(get_db)):
    """Verify email using verification link token."""
    if token not in verification_tokens:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token",
        )

    token_data = verification_tokens[token]
    if datetime.utcnow() > token_data["expires"]:
        del verification_tokens[token]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token expired",
        )

    user = db.query(User).filter(User.email == token_data["email"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_verified = True
    db.commit()
    del verification_tokens[token]

    return {"message": "Email verified successfully"}

@router.post("/verify-email/otp-request")
def request_otp(email: str, db: Session = Depends(get_db)):
    """Request OTP for email verification."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified",
        )

    otp = generate_otp()
    otp_codes[email] = {
        "code": otp,
        "expires": datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES),
        "attempts": 0
    }

    if send_otp_email(email, otp):
        return {"message": "OTP sent to your email"}
    else:
        del otp_codes[email]
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP email",
        )

@router.post("/verify-email/otp-confirm")
def verify_otp(email: str, otp: str, db: Session = Depends(get_db)):
    """Verify email using OTP code."""
    if email not in otp_codes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP found for this email. Request a new OTP.",
        )

    otp_data = otp_codes[email]

    if datetime.utcnow() > otp_data["expires"]:
        del otp_codes[email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired. Request a new OTP.",
        )

    if otp_data["attempts"] >= MAX_OTP_ATTEMPTS:
        del otp_codes[email]
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many incorrect OTP attempts. Request a new OTP.",
        )

    if otp_data["code"] != otp:
        otp_data["attempts"] += 1
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid OTP. Attempts remaining: {MAX_OTP_ATTEMPTS - otp_data['attempts']}",
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_verified = True
    db.commit()
    del otp_codes[email]

    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
def resend_verification(email: str, method: str = "link", db: Session = Depends(get_db)):
    """Resend verification email (link or OTP)."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified",
        )

    if method == "link":
        token = generate_verification_token()
        verification_tokens[token] = {
            "email": email,
            "expires": datetime.utcnow() + timedelta(hours=VERIFICATION_TOKEN_EXPIRY_HOURS),
            "type": "link"
        }
        if send_verification_email(email, token):
            return {"message": "Verification link sent"}
        else:
            del verification_tokens[token]
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send verification email",
            )
    elif method == "otp":
        otp = generate_otp()
        otp_codes[email] = {
            "code": otp,
            "expires": datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES),
            "attempts": 0
        }
        if send_otp_email(email, otp):
            return {"message": "OTP sent to your email"}
        else:
            del otp_codes[email]
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send OTP email",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification method. Use 'link' or 'otp'.",
        )