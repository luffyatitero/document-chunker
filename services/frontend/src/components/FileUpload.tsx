import React, { useRef } from "react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div
      className="border border-dashed border-gray-400 rounded p-6 text-center bg-gray-50"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      style={{ minHeight: 100 }}
    >
      <div className="mb-2">Drag and drop file here</div>
      <div className="mb-2">-or-</div>
      <button
        className="bg-gray-200 px-4 py-1 rounded"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        type="button"
      >
        Browse File
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div className="text-xs text-gray-500 mt-2">File Size Should Not Exceed 4MB</div>
    </div>
  );
};

export default FileUpload;