from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from typing import Optional

from app.schemas.document import (
    DocumentResponse, DocumentDetailResponse, DocumentListResponse,
    DocumentChunkResponse, ProcessingStatus, ChunkingConfigBase
)
from app.models import Document, DocumentChunk
from app.services.document_service import DocumentService
from app.services.document_processor import DocumentProcessor
from app.dependencies import get_db
from pathlib import Path

import uuid
import json
import math
import magic

router = APIRouter()

# Directory to store uploaded files
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/documents/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    splitter_config: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        config_dict = json.loads(splitter_config)
        config = ChunkingConfigBase(**config_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid splitter configuration: {str(e)}")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_extension = Path(file.filename).suffix.lower()
    processor = DocumentProcessor()
    if file_extension not in processor.SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_extension}. Supported types: {list(processor.SUPPORTED_EXTENSIONS.keys())}"
        )

    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename

    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        file_type = magic.from_file(str(file_path), mime=True)
        file_size = len(content)

        service = DocumentService(db)
        document = await service.process_document(
            file_path=str(file_path),
            filename=unique_filename,
            original_filename=file.filename,
            file_size=file_size,
            content_type=file_type,
            file_extension=file_extension,
            config=config
        )

        return DocumentResponse(
            id=document.id,
            filename=document.filename,
            original_filename=document.original_filename,
            file_size=document.file_size,
            content_type=document.content_type,
            file_extension=document.file_extension,
            content_length=document.content_length,
            total_chunks=document.total_chunks,
            processing_status=document.processing_status,
            error_message=document.error_message,
            created_at=document.created_at,
            updated_at=document.updated_at,
            processed_at=document.processed_at
        )

    except Exception as e:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@router.get("/documents/{document_id}", response_model=DocumentDetailResponse)
async def get_document_details(document_id: str, db: Session = Depends(get_db)):
    service = DocumentService(db)
    document = service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    chunks = service.get_document_chunks(document_id)
    chunk_responses = [
        DocumentChunkResponse(
            id=chunk.id,
            chunk_index=chunk.chunk_index,
            content=chunk.content,
            content_length=chunk.content_length,
            start_pos=chunk.start_pos,
            end_pos=chunk.end_pos,
            chunk_metadata=chunk.chunk_metadata,
            document_id=chunk.document_id,
            created_at=chunk.created_at
        )
        for chunk in chunks
    ]
    return DocumentDetailResponse(
        id=document.id,
        filename=document.filename,
        original_filename=document.original_filename,
        file_size=document.file_size,
        content_type=document.content_type,
        file_extension=document.file_extension,
        content_length=document.content_length,
        total_chunks=document.total_chunks,
        processing_status=document.processing_status,
        error_message=document.error_message,
        created_at=document.created_at,
        updated_at=document.updated_at,
        processed_at=document.processed_at,
        chunks=chunk_responses
    )

@router.get("/documents", response_model=DocumentListResponse)
async def list_documents(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[ProcessingStatus] = None,
    content_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * per_page
    query = db.query(Document)
    if status:
        query = query.filter(Document.processing_status == status)
    if content_type:
        query = query.filter(Document.content_type == content_type)
    total = query.count()
    documents = query.order_by(Document.created_at.desc()).offset(skip).limit(per_page).all()
    document_responses = [
        DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            original_filename=doc.original_filename,
            file_size=doc.file_size,
            content_type=doc.content_type,
            file_extension=doc.file_extension,
            content_length=doc.content_length,
            total_chunks=doc.total_chunks,
            processing_status=doc.processing_status,
            error_message=doc.error_message,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
            processed_at=doc.processed_at
        )
        for doc in documents
    ]
    total_pages = math.ceil(total / per_page)
    return DocumentListResponse(
        documents=document_responses,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )

@router.get("/documents/{document_id}/chunks/{chunk_id}", response_model=DocumentChunkResponse)
async def get_document_chunk(document_id: str, chunk_id: str, db: Session = Depends(get_db)):
    chunk = db.query(DocumentChunk).filter(
        DocumentChunk.id == chunk_id,
        DocumentChunk.document_id == document_id
    ).first()
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found")
    return DocumentChunkResponse(
        id=chunk.id,
        chunk_index=chunk.chunk_index,
        content=chunk.content,
        content_length=chunk.content_length,
        start_pos=chunk.start_pos,
        end_pos=chunk.end_pos,
        chunk_metadata=chunk.chunk_metadata,
        document_id=chunk.document_id,
        created_at=chunk.created_at
    )

@router.delete("/documents/{document_id}")
async def delete_document(document_id: str, db: Session = Depends(get_db)):
    service = DocumentService(db)
    document = service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).delete()
    db.delete(document)
    file_path = Path(document.file_path)
    if file_path.exists():
        file_path.unlink()
    db.commit()
    return {"message": "Document deleted successfully"}