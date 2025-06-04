from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import Document, DocumentChunk
from app.dependencies import get_db

router = APIRouter()


@router.get("/stats")
async def get_statistics(db: Session = Depends(get_db)):
    """Get service statistics"""
    total_documents = db.query(Document).count()
    total_chunks = db.query(DocumentChunk).count()
    status_counts = db.query(Document.processing_status, db.func.count(Document.id))\
        .group_by(Document.processing_status).all()
    file_type_counts = db.query(Document.content_type, db.func.count(Document.id))\
        .group_by(Document.content_type).all()
    return {
        "total_documents": total_documents,
        "total_chunks": total_chunks,
        "status_distribution": {status: count for status, count in status_counts},
        "file_type_distribution": {file_type: count for file_type, count in file_type_counts}
    }