import React from "react";

interface Parameter {
  name: string;
  value: string;
}

interface Chunk {
  id: string;
  name: string;
  size: string;
}

interface DocumentDetailProps {
  filename: string;
  size: string;
  parameters: Parameter[];
  chunks: Chunk[];
  onBack: () => void;
  onChunkSelect: (id: string) => void;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({
  filename, size, parameters, chunks, onBack, onChunkSelect
}) => (
  <div className="p-8">
    <button className="mb-4 text-2xl" onClick={onBack} title="Back">
      <span className="material-icons">arrow_back</span>
    </button>
    <div className="font-bold text-xl">{filename}</div>
    <div className="text-gray-500 mb-4">{size}</div>
    <div className="font-bold mb-2 mt-4">Parameters</div>
    <div className="mb-4">
      {parameters.map(param => (
        <div key={param.name} className="flex mb-1">
          <div className="w-40">{param.name}</div>
          <div>{param.value}</div>
        </div>
      ))}
    </div>
    <div className="font-bold mb-2">File Chunks</div>
    <div>
      {chunks.map(chunk => (
        <div
          key={chunk.id}
          className="flex items-center border-b py-2 cursor-pointer hover:bg-gray-50"
          onClick={() => onChunkSelect(chunk.id)}
        >
          <span className="material-icons text-gray-500 mr-2">insert_drive_file</span>
          <span className="font-semibold">{chunk.name}</span>
          <span className="text-xs text-gray-500 ml-2">{chunk.size}</span>
        </div>
      ))}
    </div>
  </div>
);

export default DocumentDetail;