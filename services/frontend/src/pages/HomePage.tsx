import React, { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";
import ParameterForm from "../components/ParameterForm";
import DocumentList from "../components/DocumentList";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";

const HomePage: React.FC = () => {
  const {
    documents,
    loading,
    error,
    loadDocuments,
    addDocument,
    deleteDocument,
  } = useDocuments();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parameters, setParameters] = useState({
    chunkSize: "" as number | "",
    chunkQty: "" as number | "",
    param3: "",
    param4: "",
    param5: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    // Optimistic add
    addDocument({
      id: Date.now().toString(),
      filename: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
    });
  };

  const handleParameterChange = (field: string, value: any) => {
    setParameters(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentSelect = (id: string) => {
    navigate(`/document/${id}`);
  };

  const handleDownload = (id: string) => {
    alert(`Download document ${id}`);
  };

  const handleDelete = (id: string) => {
    deleteDocument(id);
  };

  return (
    <ErrorBoundary>
      <div className="w-full">
        <div className="max-w-6xl mx-auto flex flex-row gap-8 p-8 pt-4">
          <div className="flex-1 max-w-md">
            <div className="font-bold text-xl mb-2">Upload File</div>
            <div className="border-2 border-blue-400 rounded p-4">
              <FileUpload onFileSelected={handleFileSelected} />
              <ParameterForm values={parameters} onChange={handleParameterChange} />
            </div>
          </div>
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <DocumentList
                documents={documents}
                onSelect={handleDocumentSelect}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;