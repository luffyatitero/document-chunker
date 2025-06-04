import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentDetail from "../components/DocumentDetail";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDocumentDetail } from "../hooks/useDocuments";

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { detail, detailLoading, detailError, loadDetail, clear } = useDocumentDetail();

  console.log("documentId from useParams:", documentId);
  useEffect(() => {
    if (documentId) {
      loadDetail(documentId);
    }
    return () => {
      clear();
    };
  }, [documentId, loadDetail, clear]);

  

  if (detailLoading) return <LoadingSpinner />;
  if (detailError) return <div className="text-red-600">{detailError}</div>;
  if (!detail) return <div className="text-gray-500 text-center">No details available.</div>;

  // Transform splitter_config (if present) into an array of parameters for DocumentDetail.
  const parameters = detail.splitter_config
    ? Object.entries(detail.splitter_config).map(([key, value]) => ({
        name: key,
        value: String(value)
      }))
    : [];

  // Map chunks (if present) to a shape for DocumentDetail.
  // Adjust the mapping based on your actual backend response.
  const chunks = detail.chunks
  ? detail.chunks.map((chunk: any, index: number) => ({
      id: chunk.id,
      name: chunk.name || `Chunk ${index + 1}`,  // Will default to "Chunk n"
      size: chunk.content_length ? `${chunk.content_length} chars` : "",
      content: chunk.content  // Map the content field!
    }))
  : []

  const size = `${Math.round(detail.file_size / 1024)} KB`;

  return (
    <DocumentDetail
      filename={detail.filename}
      size={size}
      parameters={parameters}
      chunks={chunks}
      onBack={() => navigate(-1)}
      onChunkSelect={(id: string) => {
        // Implement additional behavior if needed.
      }}
      selectedChunkId={undefined}
    />
  );
};

export default DocumentDetailPage;