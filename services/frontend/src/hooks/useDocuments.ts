import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { DocumentResponse, DocumentDetailResponse, DocumentListResponse, deleteDocument as apiDeleteDocument } from "../services/documentService";
import { RootState, AppDispatch } from "../store";
import {
  fetchDocuments,
  addDocumentOptimistic,
  deleteDocumentOptimistic,
  fetchDocumentDetail,
  clearDetail,
  DocumentListItem
} from "../store/slices/documentsSlice";
import { useCallback } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/documents`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error fetching documents");
      }
      const data: DocumentListResponse = await res.json();
      setDocuments(data.documents);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  async function deleteDoc(id: string) {
    try {
      await apiDeleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  function addDocument(document: DocumentResponse) {
    setDocuments(prev => [...prev, document]);
  }

  // Run loadDocuments only once when the hook is initialized.
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return {
    documents,
    loading,
    error,
    loadDocuments,
    deleteDocument: deleteDoc,
    addDocument
  };
}

export function useDocumentDetail() {
  const [detail, setDetail] = useState<DocumentDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1"}/documents/${id}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error fetching document detail");
      }
      const data: DocumentDetailResponse = await res.json();
      console.log("Document detail received:", data);
      setDetail(data);
    } catch (err: any) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDetail(null);
    setDetailError(null);
  }, []);

  return { detail, detailLoading, detailError, loadDetail, clear };
}