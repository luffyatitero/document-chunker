import React from "react";

interface ChunkViewerProps {
  chunk: { id: string; name: string; size: string; content: string };
}

const ChunkViewer: React.FC<ChunkViewerProps> = ({ chunk }) => (
  <div className="p-4 border rounded bg-white">
    <div className="font-bold mb-2">{chunk.name} <span className="text-xs text-gray-500">{chunk.size}</span></div>
    <pre className="whitespace-pre-wrap">{chunk.content}</pre>
  </div>
);

export default ChunkViewer;