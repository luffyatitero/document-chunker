import React from "react";

import "./App.css"; // Ensure you have a CSS file for global styles
import "./index.css"; // Ensure you have a CSS file for Tailwind styles

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNav from "./components/topNavComponent";
import HomePage from "./pages/HomePage";
import DocumentDetailPage from "./pages/DocumentDetailPage";

const App: React.FC = () => (
  <Router>
    <TopNav />
    <div className="pt-12 bg-gray-50 min-h-screen max-w-6xl mx-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/document/:id" element={<DocumentDetailPage />} />
      </Routes>
    </div>
  </Router>
);

export default App;