from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import health, document, stats, splitter


app = FastAPI(title="Document Chunking Service", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for different functionalities
app.include_router(health.router, prefix="/api/v1")
app.include_router(document.router, prefix="/api/v1")
app.include_router(stats.router, prefix="/api/v1")
app.include_router(splitter.router, prefix="/api/v1")