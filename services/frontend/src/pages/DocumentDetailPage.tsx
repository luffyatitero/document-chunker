import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentDetail from "../components/DocumentDetail";

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Example data; replace with API call
  const parameters = [
    { name: "Parameter 1", value: "Value" },
    { name: "Parameter 2", value: "Value" },
    { name: "Parameter 3", value: "Value" },
    { name: "Parameter 4", value: "Value" },
    { name: "Parameter 5", value: "Value" },
  ];
  const chunks = [
    { id: "1", name: "Chunk 1", size: "120 KB" },
    { id: "2", name: "Chunk 2", size: "120 KB" },
    { id: "3", name: "Chunk 3", size: "120 KB" },
    { id: "4", name: "Chunk 4", size: "120 KB" },
    { id: "5", name: "Chunk 5", size: "120 KB" },
  ];

  return (
    <DocumentDetail
      filename={`Filename ${id}`}
      size="120 KB"
      parameters={parameters}
      chunks={chunks}
      onBack={() => navigate("/")}
      onChunkSelect={chunkId => alert(`Show chunk ${chunkId}`)}
    />
  );
};

export default DocumentDetailPage;