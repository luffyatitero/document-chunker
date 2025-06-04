import { useDispatch, useSelector } from "react-redux";
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

export const useDocuments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error } = useSelector((state: RootState) => state.documents);

  const loadDocuments = useCallback(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const addDocument = (doc: DocumentListItem) => dispatch(addDocumentOptimistic(doc));
  const deleteDocument = (id: string) => dispatch(deleteDocumentOptimistic(id));

  return {
    documents,
    loading,
    error,
    loadDocuments,
    addDocument,
    deleteDocument,
  };
};

export const useDocumentDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { detail, detailLoading, detailError } = useSelector((state: RootState) => state.documents);

  const loadDetail = useCallback((id: string) => {
    dispatch(fetchDocumentDetail(id));
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearDetail());
  }, [dispatch]);

  return {
    detail,
    detailLoading,
    detailError,
    loadDetail,
    clear,
  };
};