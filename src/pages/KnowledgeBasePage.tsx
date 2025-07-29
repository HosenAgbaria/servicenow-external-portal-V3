import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { apiService } from '../services/apiService';
import type { ServiceNowKnowledgeArticle } from '../types';

export const KnowledgeBasePage: React.FC = () => {
  const [articles, setArticles] = useState<ServiceNowKnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getKnowledgeArticles({
        search: searchQuery
      });

      if (response.success && response.data) {
        setArticles(response.data.data);
      } else {
        setError(response.error || 'Failed to load articles');
      }
    } catch (err) {
      setError('An error occurred while loading articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadArticles();
  };

  const handleArticleClick = (article: ServiceNowKnowledgeArticle) => {
    navigate(`/knowledge/${article.sys_id}`);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Hardware': 'bg-blue-100 text-blue-800',
      'Software': 'bg-green-100 text-green-800',
      'Access': 'bg-purple-100 text-purple-800',
      'Technical Support': 'bg-orange-100 text-orange-800',
      'User Guide': 'bg-indigo-100 text-indigo-800',
      'Billing': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-700 transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-900 font-medium">Knowledge Base</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Knowledge Base</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions, helpful guides, and troubleshooting solutions
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base articles..."
                className="w-full pl-12 pr-4 py-4 text-lg border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Button 
                type="submit" 
                className="absolute inset-y-0 right-0 px-6 rounded-r-2xl"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" text="Loading articles..." />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Articles</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={loadArticles}>Try Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card 
                key={article.sys_id} 
                className="hover-lift group border-0 shadow-lg bg-white overflow-hidden cursor-pointer transition-all duration-300"
                onClick={() => handleArticleClick(article)}
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)} backdrop-blur-sm`}>
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/80 text-slate-700 backdrop-blur-sm">
                      {article.subcategory}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white/80 px-3 py-1 rounded-md backdrop-blur-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{article.view_count}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {article.short_description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span>By {article.author.name}</span>
                    <span>{new Date(article.published_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>{article.helpful_count} helpful</span>
                      </div>
                    </div>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-200">
                      Read Article
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Articles Found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery ? `No articles found for "${searchQuery}". Try a different search term.` : 'No articles available at the moment.'}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 