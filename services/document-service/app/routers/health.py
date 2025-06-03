from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Health"])
def healthcheck():
    return {"status": "ok"}