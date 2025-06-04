import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Chunk {
  id: string;
  name: string;
  size: string;
  content?: string;
}

export interface Parameter {
  name: string;
  value: string;
}

export interface DocumentListItem {
  id: string;
  filename: string;
  size: string;
}

export interface DocumentDetail {
  id: string;
  filename: string;
  size: string;
  parameters: Parameter[];
  chunks: Chunk[];
}

interface DocumentsState {
  documents: DocumentListItem[];
  loading: boolean;
  error: string | null;
  detail: DocumentDetail | null;
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
  detail: null,
  detailLoading: false,
  detailError: null,
};

// Simulated async thunks (replace with real API calls)
export const fetchDocuments = createAsyncThunk("documents/fetchDocuments", async () => {
  await new Promise(res => setTimeout(res, 500));
  return [
    { id: "1", filename: "Filename A", size: "120 KB" },
    { id: "2", filename: "Filename B", size: "110 KB" },
    // ...more
  ] as DocumentListItem[];
});

export const fetchDocumentDetail = createAsyncThunk(
  "documents/fetchDocumentDetail",
  async (id: string) => {
    await new Promise(res => setTimeout(res, 500));
    return {
      id,
      filename: `Filename ${id}`,
      size: "120 KB",
      parameters: [
        { name: "Parameter 1", value: "Value" },
        { name: "Parameter 2", value: "Value" },
        { name: "Parameter 3", value: "Value" },
        { name: "Parameter 4", value: "Value" },
        { name: "Parameter 5", value: "Value" },
      ],
      chunks: [
        { id: "1", name: "Chunk 1", size: "120 KB", content: "Chunk 1 content..." },
        { id: "2", name: "Chunk 2", size: "120 KB", content: "Chunk 2 content..." },
      ],
    } as DocumentDetail;
  }
);

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    addDocumentOptimistic: (state, action: PayloadAction<DocumentListItem>) => {
      state.documents.unshift(action.payload);
    },
    deleteDocumentOptimistic: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
    },
    clearDetail: (state) => {
      state.detail = null;
      state.detailError = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDocuments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch documents";
      })
      .addCase(fetchDocumentDetail.pending, state => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchDocumentDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchDocumentDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.error.message || "Failed to fetch document detail";
      });
  }
});

export const {
  addDocumentOptimistic,
  deleteDocumentOptimistic,
  clearDetail
} = documentsSlice.actions;

export default documentsSlice.reducer;