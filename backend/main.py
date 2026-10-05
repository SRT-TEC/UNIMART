import logging
import os
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

load_dotenv(Path(__file__).resolve().parent / ".env")

from Auth import router as auth_router
from review import router as review_router
from app.core.config import settings
from app.db.session import Base, engine
from app.model.user import User  # noqa: F401
from app.model.review import Review  # noqa: F401
from app.model.transaction import Transaction  # noqa: F401
from app.routers import health_router


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def validate_environment():
    """Validate required environment variables at startup."""
    db_url = os.getenv("DATABASE_URL") or getattr(settings, "DATABASE_URL", None)
    if db_url:
        os.environ.setdefault("DATABASE_URL", db_url)

    required_vars = ["DATABASE_URL"]
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        logger.error(f"Missing required environment variables: {', '.join(missing)}")
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")
    logger.info("Environment validation passed")


def init_db():
    """Initialize database tables."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        raise


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events."""
    logger.info("UNIMART API starting up...")
    validate_environment()
    init_db()
    logger.info("UNIMART API startup complete")
    yield
    logger.info("UNIMART API shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description="API for UNIMART - A student marketplace for buying and selling items",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Add unique request ID to all requests for tracing."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    logger.info(f"Request {request_id}: {request.method} {request.url.path} - {response.status_code}")
    return response


cors_origins = []
if os.getenv("ENVIRONMENT", "development") == "development":
    cors_origins = ["*"]
    logger.warning("CORS: Allowing all origins (development mode)")
else:
    cors_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
    if not cors_origins or cors_origins == [""]:
        cors_origins = ["https://localhost:3000"]
    logger.info(f"CORS: Restricting to origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    max_age=3600,
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with structured response."""
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation failed",
            "errors": exc.errors(),
            "request_id": getattr(request.state, "request_id", None),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unexpected error on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "request_id": getattr(request.state, "request_id", None),
        },
    )


app.include_router(auth_router, prefix="/api/v1")
app.include_router(review_router, prefix="/api/v1")
app.include_router(health_router)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    try:
        from app.db.session import SessionLocal

        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        db_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        db_status = "disconnected"

    health_status = "healthy" if db_status == "connected" else "degraded"
    return {
        "status": health_status,
        "service": settings.APP_NAME,
        "database": db_status,
        "version": "1.0.0",
    }


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint providing API information."""
    return {
        "name": settings.APP_NAME,
        "description": "A student marketplace for buying and selling items",
        "version": "1.0.0",
        "docs": "/api/docs",
        "redoc": "/api/redoc",
        "health": "/health",
    }
