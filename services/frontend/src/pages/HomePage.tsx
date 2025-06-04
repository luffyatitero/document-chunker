import React, { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";
import ParameterForm from "../components/ParameterForm";
import DocumentList from "../components/DocumentList";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { uploadDocument, fetchSplitterConfig } from "../services/documentService";

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
    splitter_type: "",
    chunk_size: "",
    chunk_overlap: "",
    length_function: "",
    separator_type: "",
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const [splitterConfig, setSplitterConfig] = useState<any>(null);
  const [recommended, setRecommended] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();  // Lists previously uploaded files
  }, [loadDocuments]);

  useEffect(() => {
    fetchSplitterConfig()
      .then(setSplitterConfig)
      .catch((err) => {
        console.error("Failed to fetch splitter config", err);
      });
  }, []);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    if (splitterConfig && splitterConfig.recommendations) {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const rec = fileExt && splitterConfig.recommendations[fileExt];
      setRecommended(rec || null);
      // Optionally auto-fill parameters with recommended values
      if (rec) {
        setParameters({
          splitter_type: rec.splitter_type || "",
          chunk_size: rec.chunk_size || "",
          chunk_overlap: rec.chunk_overlap || "",
          length_function: rec.length_function || "",
          separator_type: rec.separators
            ? Array.isArray(rec.separators)
              ? rec.separators[0]
              : rec.separators
            : "",
        });
      }
    } else {
      setRecommended(null);
    }
  };

  const handleParameterChange = (field: string, value: any) => {
    setParameters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyRecommendation = () => {
    if (recommended) {
      setParameters({
        splitter_type: recommended.splitter_type || "",
        chunk_size: recommended.chunk_size || "",
        chunk_overlap: recommended.chunk_overlap || "",
        length_function: recommended.length_function || "",
        separator_type: recommended.separators
          ? Array.isArray(recommended.separators)
            ? recommended.separators[0]
            : recommended.separators
          : "",
      });
    }
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

  const handleProcessDocument = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    // Validate required fields before sending
    if (
      !parameters.splitter_type ||
      !parameters.chunk_size ||
      !parameters.chunk_overlap ||
      !parameters.length_function ||
      !parameters.separator_type
    ) {
      alert("Please fill all required parameters.");
      return;
    }
    try {
      setProcessing(true);
      // Upload the document with current parameters (all keys in snake_case)
      const response = await uploadDocument(selectedFile, parameters);

      // Check that backend returned file_path (which now comes from document.file_path)
      if (!response.file_path) {
        alert("Backend did not return file_path. Please check backend implementation.");
      }

      // Add document to the list – you may pass additional properties if needed.
      addDocument({
        ...response,
        size: `${Math.round(response.file_size / 1024)} KB`
      });

      setSelectedFile(null);
      setRecommended(null);
      alert("Document processed successfully!");
    } catch (err: any) {
      alert(err.message || "Error processing document");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-full">
        <div className="max-w-6xl mx-auto flex flex-row gap-8 p-8 pt-4">
          <div className="flex-1 max-w-md">
            <div className="font-bold text-xl mb-2">Upload File</div>
            <div className="border-2 border-blue-400 rounded p-4">
              <FileUpload
                onFileSelected={handleFileSelected}
                selectedFile={selectedFile ?? undefined}
              />
              <ParameterForm
                values={parameters}
                onChange={handleParameterChange}
                splitterTypes={splitterConfig?.splitter_types || []}
                lengthFunctions={splitterConfig?.length_functions || []}
                recommendation={recommended}
                onApplyRecommendation={handleApplyRecommendation}
              />
              <button
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={handleProcessDocument}
                disabled={processing || !selectedFile}
              >
                {processing ? "Processing..." : "Process Document"}
              </button>
            </div>
          </div>
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <DocumentList
                documents={documents.map((doc) => ({
                  ...doc,
                  // Ensure size is always defined
                  size: doc.size ? doc.size : `${Math.round(doc.file_size / 1024)} KB`
                }))}
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