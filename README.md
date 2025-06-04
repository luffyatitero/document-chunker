# Document Chunker

A full-stack application for uploading documents, splitting them into chunks, and visualizing both the document and its chunks. Built with React (TypeScript, Tailwind CSS), FastAPI, and LangChain, this project demonstrates modern component-driven frontend development and robust backend API design.

---

## Table of Contents

- [Development Setup](#development-setup)
  - [Using Docker](#using-docker)
  - [Without Docker (Manual Setup)](#without-docker-manual-setup)
- [Product Usage Guide](#product-usage-guide)
- [Project Structure & Features](#project-structure--features)
- [Technical Overview](#technical-overview)
- [Acknowledgements](#acknowledgements)

---

## Development Setup

### Using Docker

**Prerequisites:**  
- [Docker](https://www.docker.com/get-started) installed on your machine.

**Steps:**

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd document-chunker
   ```

2. **Start the backend (document-service):**
   ```bash
   docker-compose up --build
   ```
   This will build and run the FastAPI backend on [http://localhost:8000](http://localhost:8000).

3. **Start the frontend (in a separate terminal):**
   ```bash
   cd services/frontend
   npm install
   npm start
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000).

> **Note:**  
> The provided `docker-compose.yml` currently only includes the backend.  
> To run the frontend in Docker, uncomment the `frontend` service in `docker-compose.yml` and rebuild.

---

### Without Docker (Manual Setup)

#### Backend (FastAPI)

1. **Install Python dependencies:**
   ```bash
   cd services/document-service
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend (React)

1. **Install Node dependencies:**
   ```bash
   cd services/frontend
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm start
   ```

---

## Product Usage Guide

### Uploading and Chunking a Document

1. **Open the app** at [http://localhost:3000](http://localhost:3000).
2. **Upload a document** (PDF or supported file type) using the upload form.
3. **Configure chunking parameters** if needed (e.g., chunk size).
4. **Submit**. The document will be processed and split into chunks on the backend.

### Viewing Documents and Chunks

- **Previously Uploaded**:  
  The homepage lists all uploaded documents.  
  - Click a document to view its details and chunks.
  - Download or delete documents as needed.

- **Document Detail Page**:  
  - The left panel lists all chunks for the selected document.
  - Click a chunk to view its content with syntax highlighting in the right panel.
  - Use the back button to return to the document list.

---

## Project Structure & Features

### Backend (`services/document-service`)

- **FastAPI** application for:
  - Uploading documents.
  - Splitting documents into chunks using LangChain.
  - Storing metadata and chunk data in SQLite.
  - Serving chunk and document data via RESTful endpoints.

- **Key Endpoints:**
  - `POST /documents/upload` — Upload and process a document.
  - `GET /documents` — List all documents.
  - `GET /documents/{id}` — Retrieve document details and chunks.
  - `DELETE /documents/{id}` — Delete a document and its chunks.

### Frontend (`services/frontend`)

- **React + TypeScript + Tailwind CSS** SPA.
- **Component-driven**:  
  - `DocumentList`: Shows all uploaded documents.
  - `DocumentDetail`: Two-panel view for chunk navigation and content display.
  - `LoadingSpinner`, `TopNav`, and other reusable UI components.

- **Features:**
  - File upload with chunking parameter configuration.
  - Responsive, clean UI with Material Icons and Tailwind.
  - Syntax-highlighted chunk content using `react-syntax-highlighter`.
  - Chunk selection and navigation.
  - Download and delete actions for documents.

---

## Technical Overview

### Architecture

- **Frontend:**  
  Built with React and TypeScript, the frontend is a single-page application (SPA) that provides a modern, responsive UI using Tailwind CSS. It communicates with the backend via RESTful APIs and manages state using React hooks. All document and chunk operations (upload, list, detail, delete) are handled through well-structured components and hooks.

- **Backend:**  
  The backend is implemented with FastAPI (Python), exposing endpoints for document upload, chunking, retrieval, and deletion. It uses LangChain for document chunking and SQLAlchemy with SQLite for persistent storage of documents and their chunks.

### Key Features

- **Document Upload & Chunking:**  
  Users can upload documents (e.g., PDFs). The backend processes each document, splitting it into logical chunks using LangChain’s text splitters. Each chunk is stored with metadata (such as chunk index, content length, and optional parameters).

- **Chunk Visualization:**  
  The frontend displays a list of all uploaded documents. Selecting a document opens a detail view with a two-panel layout:
  - **Left Panel:** Selectable list of all chunks for the document.
  - **Right Panel:** Content of the selected chunk, rendered with syntax highlighting for easy reading.

- **Parameter Configuration:**  
  When uploading, users can specify chunking parameters (like chunk size). These are stored and displayed alongside each document.

- **API Integration:**  
  The frontend uses custom React hooks (`useDocuments`, `useDocumentDetail`) to fetch and manage document and chunk data from the backend. All API URLs are configurable via environment variables.

- **State Management:**  
  The application uses local React state for UI interactions (such as chunk selection) and loading/error handling, ensuring a smooth user experience.

- **Responsive Design:**  
  Tailwind CSS ensures the UI adapts to different screen sizes, with a clean and accessible layout.

- **Extensibility:**  
  The modular structure allows for easy extension:
  - Add new chunking strategies or file types in the backend.
  - Enhance the UI or add new features in the frontend with minimal refactoring.

### Data Flow

1. **Upload:**  
   User uploads a document via the frontend. The file and parameters are sent to the backend.

2. **Processing:**  
   The backend saves the file, splits it into chunks, and stores all data in SQLite.

3. **Listing:**  
   The frontend fetches and displays all documents using the `/documents` endpoint.

4. **Detail View:**  
   When a document is selected, the frontend fetches its details and chunks from `/documents/{id}` and displays them in a two-panel layout.

5. **Chunk Navigation:**  
   Users can select any chunk from the list to view its content with syntax highlighting.

6. **Download/Delete:**  
   Users can download or delete documents directly from the UI, with changes reflected immediately.

### Additional Technical Details

- **Chunking Logic:**  
  The backend leverages LangChain’s text splitting utilities, allowing for flexible chunking strategies (by size, by page, etc.). Chunk metadata and content are stored in a normalized SQLite schema for efficient retrieval.

- **Error Handling:**  
  Both frontend and backend provide clear error messages for failed uploads, processing errors, or API issues, ensuring users are informed of any problems.

- **Environment Configuration:**  
  API endpoints and other environment-specific settings are managed via environment variables, making the project easy to deploy in different environments.

- **Testing & Extensibility:**  
  The codebase is organized for maintainability and extensibility. Adding new features, endpoints, or UI components can be done with minimal changes to existing code.

---

## Acknowledgements

- [Create React App](https://create-react-app.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [LangChain](https://python.langchain.com/)
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [Tailwind CSS](https://tailwindcss.com/)

---

**For any questions or contributions, please open an issue or submit a pull request.**
