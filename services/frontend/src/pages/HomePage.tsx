import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import ParameterForm from "../components/ParameterForm";
import DocumentList, { DocumentListItem } from "../components/DocumentList";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parameters, setParameters] = useState({
    chunkSize: "" as number | "",
    chunkQty: "" as number | "",
    param3: "",
    param4: "",
    param5: "",
});
  const [documents, setDocuments] = useState<DocumentListItem[]>([
    // Example data; replace with API call
    { id: "1", filename: "Filename A", size: "120 KB" },
    { id: "2", filename: "Filename B", size: "110 KB" },
    { id: "3", filename: "Filename C", size: "100 KB" },
    { id: "4", filename: "Filename D", size: "120 KB" },
    { id: "5", filename: "FilenameE", size: "120 KB" },
    { id: "6", filename: "Filename F", size: "120 KB" },
    { id: "7", filename: "Filename G", size: "120 KB" },
    { id: "8", filename: "Filename H", size: "120 KB" },
  ]);
  const navigate = useNavigate();

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    // Optionally, upload file here
  };

  const handleParameterChange = (field: string, value: any) => {
    setParameters(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentSelect = (id: string) => {
    navigate(`/document/${id}`);
  };

  const handleDownload = (id: string) => {
    // Implement download logic
    alert(`Download document ${id}`);
  };

  const handleDelete = (id: string) => {
    // Implement delete logic
    setDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  return (
    <div className="flex flex-row gap-8 p-8 pt-4">
      <div className="flex-1 max-w-md">
        <div className="font-bold text-xl mb-2">Upload File</div>
        <div className="border-2 border-blue-400 rounded p-4">
          <FileUpload onFileSelected={handleFileSelected} />
          <ParameterForm values={parameters} onChange={handleParameterChange} />
        </div>
      </div>
      <div className="flex-1">
        <DocumentList
          documents={documents}
          onSelect={handleDocumentSelect}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default HomePage;