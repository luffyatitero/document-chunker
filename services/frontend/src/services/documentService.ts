// Define your API base URL (adjust as needed)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

// Define interfaces for the responses (you can adjust these according to your schemas)
export interface DocumentResponse {
  id: string;
  filename: string;
  original_filename?: string;
  file_size: number;
  content_type: string;
  file_path: string;
  file_extension?: string;
  content_length?: number;
  total_chunks?: number;
  processing_status: string;
  error_message?: string;
  created_at: string;
  updated_at?: string;
  processed_at?: string;
  splitter_config?: {
    chunkSize: number | "";
    chunkQty: number | "";
    param3?: string;
    param4?: string;
    param5?: string;
  };
  size?: string;
}

export interface DocumentListResponse {
  documents: DocumentResponse[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Parameter {
  name: string;
  value: string;
}

export interface Chunk {
  id: string;
  name: string;
  size: string;
  content?: string;
}

export interface DocumentDetailResponse extends DocumentResponse {
  parameters: Parameter[];
  chunks: Chunk[];
}

// Upload payload expects a file and a splitter configuration string.
export async function uploadDocument(file: File, splitterConfig: object): Promise<DocumentResponse> {
  const url = `${API_BASE_URL}/documents/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("splitter_config", JSON.stringify(splitterConfig));

  const response = await fetch(url, { method: "POST", body: formData });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error uploading document");
  }
  return response.json();
}

// Fetch the list of documents (paginated)
export async function fetchDocuments(page: number = 1, perPage: number = 20): Promise<DocumentListResponse> {
  const url = `${API_BASE_URL}/documents?page=${page}&per_page=${perPage}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error fetching documents");
  }
  return response.json();
}

// Fetch document detail (including chunks)
export async function fetchDocumentDetail(documentId: string): Promise<DocumentDetailResponse> {
  const url = `${API_BASE_URL}/documents/${documentId}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error fetching document detail");
  }
  return response.json();
}

// Optionally, fetch a specific chunk content (if you wish to use a dedicated endpoint)
export async function fetchDocumentChunk(documentId: string, chunkId: string): Promise<Chunk> {
  const url = `${API_BASE_URL}/documents/${documentId}/chunks/${chunkId}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error fetching document chunk");
  }
  return response.json();
}

export interface SplitterRecommendation {
  splitter_type: string;
  chunk_size: number;
  chunk_overlap: number;
  length_function: string;
  separators?: string[];
}

export interface SplitterConfigResponse {
  splitter_types: any[];        // Define more specific types if needed
  length_functions: any[];        // Define more specific types if needed
  recommendations: {
    [key: string]: SplitterRecommendation;
  };
}

// Then update your function signature:
export async function fetchSplitterConfig(): Promise<SplitterConfigResponse> {
  const url = `${API_BASE_URL}/splitters/config`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error fetching splitter config");
  }
  return response.json();
}

export async function deleteDocument(documentId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error deleting document");
  }
}