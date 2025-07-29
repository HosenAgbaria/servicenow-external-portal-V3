import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ServiceCatalogPage } from './pages/ServiceCatalogPage';
import { RequestSubmissionPage } from './pages/RequestSubmissionPage';
import { RequestsListPage } from './pages/RequestsListPage';
import { RequestDetailsPage } from './pages/RequestDetailsPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { KnowledgeArticleDetailPage } from './pages/KnowledgeArticleDetailPage';
import { StoredRequestsPage } from './pages/StoredRequestsPage';
import { useUIStore } from './stores/uiStore';
import './i18n'; // Initialize i18n

function App() {
  const { theme } = useUIStore();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900 text-white' 
          : 'bg-white text-slate-900'
      }`}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<ServiceCatalogPage />} />
            <Route path="/catalog/:itemId" element={<RequestSubmissionPage />} />
            <Route path="/requests" element={<RequestsListPage />} />
            <Route path="/requests/:requestId" element={<RequestDetailsPage />} />
            <Route path="/knowledge" element={<KnowledgeBasePage />} />
            <Route path="/knowledge/:articleId" element={<KnowledgeArticleDetailPage />} />
            <Route path="/stored-requests" element={<StoredRequestsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
