import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { apiService } from '../services/api';
import type { ServiceNowKnowledgeArticle } from '../types';

export const KnowledgeArticleDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<ServiceNowKnowledgeArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ServiceNowKnowledgeArticle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (articleId) {
      loadArticle();
      loadRelatedArticles();
    }
  }, [articleId]);

  const loadArticle = async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, we'll simulate getting a single article
      // In real implementation, this would be a separate API call
      const response = await apiService.getKnowledgeArticles({});
      
      if (response.success && response.data) {
        const foundArticle = response.data.data.find(a => a.sys_id === articleId);
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found');
        }
      } else {
        setError(response.error || 'Failed to load article');
      }
    } catch (err) {
      setError('An error occurred while loading the article');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedArticles = async () => {
    try {
      const response = await apiService.getKnowledgeArticles({});
      if (response.success && response.data) {
        // Get 3 random articles as related (excluding current article)
        const filtered = response.data.data.filter(a => a.sys_id !== articleId);
        setRelatedArticles(filtered.slice(0, 3));
      }
    } catch (err) {
      // Silently fail for related articles
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading article..." />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-8">{error || 'The requested article could not be found.'}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/knowledge')}>
                Back to Knowledge Base
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-700 transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/knowledge" className="hover:text-slate-700 transition-colors">
            Knowledge Base
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-900 font-medium line-clamp-1">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white overflow-hidden">
              {/* Article Header */}
              <div className="h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <div className="absolute top-6 left-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)} backdrop-blur-sm`}>
                    {article.category}
                  </span>
                </div>
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-white/80 text-slate-700 backdrop-blur-sm">
                    {article.subcategory}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{article.title}</h1>
                  <div className="flex items-center space-x-4 text-slate-600">
                    <span>By {article.author.name}</span>
                    <span>•</span>
                    <span>{new Date(article.published_date).toLocaleDateString()}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{article.view_count} views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <CardContent className="p-8">
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    {article.short_description}
                  </p>
                  
                  <div className="bg-slate-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Article Content</h3>
                    <div className="text-slate-700 leading-relaxed">
                      <p className="mb-4">
                        This is a detailed article about {article.title.toLowerCase()}. The content would include comprehensive information, step-by-step instructions, troubleshooting tips, and best practices.
                      </p>
                      <p className="mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p className="mb-4">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </div>
                  </div>

                  {/* Article Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Helpful ({article.helpful_count})
                      </Button>
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share
                      </Button>
                    </div>
                    <Button onClick={() => navigate('/knowledge')}>
                      Back to Knowledge Base
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Articles */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <div 
                    key={relatedArticle.sys_id}
                    className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all duration-200"
                    onClick={() => handleArticleClick(relatedArticle)}
                  >
                    <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {relatedArticle.short_description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{relatedArticle.category}</span>
                      <span>{relatedArticle.view_count} views</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Article Info */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Article Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <p className="text-slate-900">{article.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Subcategory</label>
                  <p className="text-slate-900">{article.subcategory}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Author</label>
                  <p className="text-slate-900">{article.author.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Published</label>
                  <p className="text-slate-900">{new Date(article.published_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Views</label>
                  <p className="text-slate-900">{article.view_count.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Helpful Votes</label>
                  <p className="text-slate-900">{article.helpful_count}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}; 