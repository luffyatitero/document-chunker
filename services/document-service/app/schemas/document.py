from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class SplitterType(str, Enum):
    RECURSIVE = "recursive"
    CHARACTER = "character"
    TOKEN = "token"
    MARKDOWN = "markdown"
    HTML = "html"
    CODE = "code"


class LengthFunction(str, Enum):
    LEN = "len"
    TIKTOKEN = "tiktoken"
    HUGGINGFACE = "huggingface"


class ProcessingStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class DocumentBase(BaseModel):
    filename: str
    original_filename: Optional[str] = None
    file_path: str
    file_size: int
    content_type: str
    file_extension: Optional[str] = None
    content: Optional[str] = None
    content_length: int = 0


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    processing_status: Optional[ProcessingStatus] = None
    error_message: Optional[str] = None
    total_chunks: Optional[int] = None
    content: Optional[str] = None
    content_length: Optional[int] = None
    processed_at: Optional[datetime] = None


class DocumentResponse(DocumentBase):
    id: str
    total_chunks: int = 0
    processing_status: ProcessingStatus
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class ChunkingConfigBase(BaseModel):
    chunk_size: int
    chunk_overlap: int
    separator_type: str
    custom_separators: Optional[List[str]] = None
    splitter_type: Optional[SplitterType] = None
    length_function: Optional[LengthFunction] = LengthFunction.LEN
    additional_params: Optional[Dict[str, Any]] = None


class ChunkingConfigCreate(ChunkingConfigBase):
    document_id: str


class ChunkingConfigUpdate(BaseModel):
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None
    separator_type: Optional[str] = None
    custom_separators: Optional[List[str]] = None
    splitter_type: Optional[SplitterType] = None
    length_function: Optional[LengthFunction] = None
    additional_params: Optional[Dict[str, Any]] = None


class ChunkingConfigResponse(ChunkingConfigBase):
    id: str
    document_id: str

    class Config:
        orm_mode = True


class DocumentChunkBase(BaseModel):
    chunk_index: int
    content: str
    content_length: Optional[int] = None
    start_pos: Optional[int] = None
    end_pos: Optional[int] = None
    chunk_metadata: Optional[Dict[str, Any]] = None


class DocumentChunkCreate(DocumentChunkBase):
    document_id: str


class DocumentChunkUpdate(BaseModel):
    content: Optional[str] = None
    content_length: Optional[int] = None
    start_pos: Optional[int] = None
    end_pos: Optional[int] = None
    chunk_metadata: Optional[Dict[str, Any]] = None


class DocumentChunkResponse(DocumentChunkBase):
    id: str
    document_id: str
    created_at: datetime

    class Config:
        orm_mode = True


class DocumentDetailResponse(DocumentResponse):
    chunks: List[DocumentChunkResponse] = []


class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]
    total: int
    page: int
    per_page: int
    total_pages: int