import React from "react";

export interface DocumentListItem {
  id: string;
  filename: string;
  size: string;
}

interface DocumentListProps {
  documents: DocumentListItem[];
  onSelect: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onSelect, onDownload, onDelete }) => (
  <div className="border rounded p-4 bg-white">
    <div className="font-bold mb-2">Previously Uploaded</div>
    <div className="space-y-2">
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center justify-between border rounded px-3 py-2 hover:bg-gray-50">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onSelect(doc.id)}>
            <span className="material-icons text-gray-500">insert_drive_file</span>
            <span className="font-semibold">{doc.filename}</span>
            <span className="text-xs text-gray-500">{doc.size}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => onDownload(doc.id)} className="text-gray-500 hover:text-black" title="Download">
              <span className="material-icons">download</span>
            </button>
            <button onClick={() => onDelete(doc.id)} className="text-gray-500 hover:text-red-600" title="Delete">
              <span className="material-icons">delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DocumentList;