import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { apiService } from '../services/apiService';
import type { ServiceNowKnowledgeArticle } from '../types';

export const KnowledgeBasePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<ServiceNowKnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isRTL = i18n.language === 'he' || i18n.language === 'ar';

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
      'Hardware': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25',
      'Software': 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25',
      'Access': 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25',
      'Technical Support': 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25',
      'User Guide': 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25',
      'Billing': 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25'
    };
    return colors[category as keyof typeof colors] || 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-lg shadow-slate-500/25';
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      'Hardware': 'from-blue-400/20 via-blue-500/10 to-blue-600/20',
      'Software': 'from-emerald-400/20 via-green-500/10 to-emerald-600/20',
      'Access': 'from-purple-400/20 via-violet-500/10 to-purple-600/20',
      'Technical Support': 'from-orange-400/20 via-amber-500/10 to-orange-600/20',
      'User Guide': 'from-indigo-400/20 via-blue-500/10 to-indigo-600/20',
      'Billing': 'from-rose-400/20 via-pink-500/10 to-rose-600/20'
    };
    return gradients[category as keyof typeof gradients] || 'from-slate-400/20 via-gray-500/10 to-slate-600/20';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Breadcrumb */}
        <nav className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-sm text-slate-500 mb-6`}>
          <Link to="/" className="hover:text-slate-700 transition-colors">
            {t('navigation.home')}
          </Link>
          <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-900 font-medium">{t('navigation.knowledgeBase')}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
            {t('knowledgeBase.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('knowledgeBase.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-16">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="relative group">
              {/* Background glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 blur opacity-15 group-focus-within:opacity-30 transition-opacity duration-500" style={{borderRadius: '8px'}}></div>
              
              {/* Main search container */}
              <div className="relative bg-white border border-blue-100/50 shadow-xl group-focus-within:shadow-blue-400/20 transition-all duration-500" style={{borderRadius: '8px'}}>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('knowledgeBase.searchPlaceholder')}
                  className={`w-full ${isRTL ? 'pr-20 pl-36' : 'pl-20 pr-36'} py-6 text-lg bg-white border-0 focus:ring-0 focus:outline-none placeholder:text-blue-400/70 text-slate-700 font-medium`}
                  style={{borderRadius: '8px'}}
                />
                
                {/* Search icon - standalone without background */}
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-6' : 'left-0 pl-6'} flex items-center pointer-events-none`}>
                  <svg className="h-6 w-6 mx-3 text-blue-500 group-focus-within:text-blue-600 group-focus-within:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Search button */}
                <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-2' : 'right-0 pr-2'} flex items-center`}>
                  <Button 
                    type="submit" 
                    className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 border-0 ${isRTL ? 'ml-2' : 'mr-2'}`}
                    style={{borderRadius: '6px'}}
                  >
                    {t('common.search')}
                  </Button>
                </div>
                
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/10 via-blue-500/10 to-indigo-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          </form>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" text={t('knowledgeBase.loadingArticles')} />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('knowledgeBase.errorLoadingArticles')}</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={loadArticles}>{t('knowledgeBase.tryAgain')}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card 
                key={article.sys_id} 
                className="group border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:scale-[1.02] rounded-2xl"
                onClick={() => handleArticleClick(article)}
              >
                <div className={`h-52 bg-gradient-to-br ${getCategoryGradient(article.category)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] opacity-60"></div>
                  
                  {/* Floating geometric shapes for visual interest */}
                  <div className="absolute top-6 right-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-8 left-6 w-12 h-12 bg-white/5 rounded-lg rotate-45"></div>
                  
                  <div className="absolute top-5 left-5">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(article.category)} transform hover:scale-105 transition-transform duration-200`}>
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-5 right-5">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 text-slate-700 backdrop-blur-md shadow-lg border border-white/20">
                      {article.subcategory}
                    </span>
                  </div>
                  <div className="absolute bottom-5 right-5">
                    <div className="flex items-center space-x-2 text-sm text-slate-700 bg-white/90 px-4 py-2 rounded-lg backdrop-blur-md shadow-lg border border-white/20">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">{article.view_count}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-7">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3 text-sm">
                    {article.short_description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100">
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {article.author.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-700">{t('knowledgeBase.by')} {article.author.name}</span>
                    </div>
                    <span className="text-slate-500 bg-slate-50 px-3 py-1 rounded-full text-xs">
                      {new Date(article.published_date).toLocaleDateString(i18n.language === 'he' ? 'he-IL' : i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-slate-500`}>
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        </div>
                        <span className="font-medium text-slate-700">{article.helpful_count} {t('knowledgeBase.helpful')}</span>
                      </div>
                    </div>
                    <div className={`flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-all duration-300 bg-blue-50 group-hover:bg-blue-100 px-4 py-2 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t('knowledgeBase.readArticle')}
                      <svg className={`w-4 h-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform duration-300 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg className="h-4 w-4 mx-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('knowledgeBase.noArticlesFound')}</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery ? t('knowledgeBase.noArticlesForSearch', { query: searchQuery }) : t('knowledgeBase.noArticlesAvailable')}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')} variant="outline">
                {t('knowledgeBase.clearSearch')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};