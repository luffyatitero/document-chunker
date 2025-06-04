from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional, Dict, Any


from app.models import Document, DocumentChunk, ChunkingConfig
from app.schemas.document import ChunkingConfigBase
from app.services.document_processor import DocumentProcessor


class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.processor = DocumentProcessor()

    async def process_document(
        self,
        file_path: str,
        filename: str,
        original_filename: str,
        file_size: int,
        content_type: str,
        file_extension: str,
        config: ChunkingConfigBase
    ) -> Document:
        """Process uploaded document and create chunks"""

        # Create document record
        document = Document(
            filename=filename,
            original_filename=original_filename,
            file_path=file_path,
            file_size=file_size,
            content_type=content_type,
            file_extension=file_extension,
            processing_status="processing"
        )
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)

        # Store chunking config
        chunking_config = ChunkingConfig(
            document_id=document.id,
            chunk_size=config.chunk_size,
            chunk_overlap=config.chunk_overlap,
            separator_type=config.separator_type,
            custom_separators=config.custom_separators,
            splitter_type=config.splitter_type.value if config.splitter_type else None,
            length_function=config.length_function.value if config.length_function else "len",
            additional_params=config.additional_params
        )
        self.db.add(chunking_config)
        self.db.commit()

        try:
            # Extract text content
            content, metadata = await self.processor.extract_text_from_file(file_path, content_type)

            # Update document with content
            document.content = content
            document.content_length = len(content)

            # Create text splitter and split content
            splitter = self.processor.get_text_splitter(config)
            chunks = splitter.split_text(content)

            # Create chunk records
            for i, chunk_content in enumerate(chunks):
                chunk = DocumentChunk(
                    document_id=document.id,
                    chunk_index=i,
                    content=chunk_content,
                    content_length=len(chunk_content),
                    chunk_metadata=metadata
                )
                self.db.add(chunk)

            # Update document status
            document.total_chunks = len(chunks)
            document.processing_status = "completed"
            document.processed_at = datetime.utcnow()

            self.db.commit()
            return document

        except Exception as e:
            document.processing_status = "failed"
            document.error_message = str(e)
            self.db.commit()
            raise e

    def get_document(self, document_id: str) -> Optional[Document]:
        return self.db.query(Document).filter(Document.id == document_id).first()

    def get_document_chunks(self, document_id: str) -> List[DocumentChunk]:
        return self.db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id
        ).order_by(DocumentChunk.chunk_index).all()

    def list_documents(self, skip: int = 0, limit: int = 100) -> tuple[List[Document], int]:
        query = self.db.query(Document)
        total = query.count()
        documents = query.offset(skip).limit(limit).all()
        return documents, total