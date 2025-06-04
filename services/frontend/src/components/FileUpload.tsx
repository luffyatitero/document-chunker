import React, { useRef } from "react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  selectedFile?: File;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, disabled, selectedFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="border border-dashed border-gray-500 rounded p-4 text-center">
      <div>
        <button
          type="button"
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Browse File
        </button>
      </div>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {selectedFile && (
        <div className="mt-2 text-gray-600">
          Selected: <span className="font-medium">{selectedFile.name}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;