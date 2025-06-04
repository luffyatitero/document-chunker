import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentDetail from "../components/DocumentDetail";
import { useDocumentDetail } from "../hooks/useDocuments";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { detail, detailLoading, detailError, loadDetail, clear } = useDocumentDetail();

  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadDetail(id);
    return () => { clear(); };
  }, [id, loadDetail, clear]);

  useEffect(() => {
    // Select first chunk by default when detail loads
    if (detail && detail.chunks.length > 0) {
      setSelectedChunkId(detail.chunks[0].id);
    }
  }, [detail]);

  const selectedChunk = detail?.chunks.find(chunk => chunk.id === selectedChunkId);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-[80vh] flex justify-center items-start">
        <div className="max-w-6xl w-full flex gap-8 bg-white rounded shadow-sm p-8 mt-8">
          {/* Left: Document Info and Chunks */}
          <div className="flex-1 min-w-0">
            {detailLoading ? (
              <LoadingSpinner />
            ) : detailError ? (
              <div className="text-red-600">{detailError}</div>
            ) : detail ? (
              <DocumentDetail
                filename={detail.filename}
                size={detail.size}
                parameters={detail.parameters}
                chunks={detail.chunks}
                onBack={() => navigate("/")}
                onChunkSelect={setSelectedChunkId}
                selectedChunkId={selectedChunkId ?? undefined}
              />
            ) : (
              <div>No document found.</div>
            )}
          </div>
          {/* Right: Chunk Content */}
          <div className="flex-1 min-w-0 bg-gray-50 rounded p-4 overflow-auto">
            {selectedChunk ? (
              <>
                <div className="font-bold mb-2">
                  {selectedChunk.name}
                  <span className="text-xs text-gray-500 ml-2">{selectedChunk.size}</span>
                </div>
                <SyntaxHighlighter
                  language="python"
                  style={vscDarkPlus}
                  customStyle={{ borderRadius: 8, fontSize: 14, minHeight: 200 }}
                  showLineNumbers
                >
                  {selectedChunk.content || "// No content"}
                </SyntaxHighlighter>
              </>
            ) : (
              <div className="text-gray-400 italic">Select a chunk to view its content.</div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DocumentDetailPage;