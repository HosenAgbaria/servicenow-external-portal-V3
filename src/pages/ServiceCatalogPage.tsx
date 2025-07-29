import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useCatalogStore } from '../stores/catalogStore';
import { useUIStore } from '../stores/uiStore';
import { apiService } from '../services/apiService';
import type { ServiceNowCatalogItem } from '../types';

export const ServiceCatalogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useUIStore();
  const { items, loading, error, setItems, setLoading, setError } = useCatalogStore();
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  });
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Update category filter when language changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, category: t('catalog.allCategories') }));
  }, [t, i18n.language]);

  // Helper function to safely render HTML content
  const renderHtmlContent = (htmlContent: string) => {
    if (!htmlContent) return t('common.noDescription');
    
    // Strip potentially dangerous tags and attributes
    const cleanHtml = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '');
    
    return cleanHtml;
  };

  const fetchCatalogItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getCatalogItems({ limit: 100 });
      
      if (response.success && response.data) {
        const catalogItems = response.data.data || [];
        setItems(catalogItems);
      } else {
        setError(response.message || 'Failed to fetch catalog items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch catalog items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogItems();
  }, []);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const filteredItems = items.filter((item: ServiceNowCatalogItem) => {
    const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         item.short_description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === t('catalog.allCategories') || 
                           item.category === filters.category;
    return matchesSearch && matchesCategory;
  });

  const allCategories = [t('catalog.allCategories'), ...Array.from(new Set(items.map((item: ServiceNowCatalogItem) => item.category).filter(Boolean)))];
  const displayedCategories = showAllCategories ? allCategories : allCategories.slice(0, 12);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Hardware': theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
      'Software': theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      'Access': theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800',
      'Technical Support': theme === 'dark' ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800',
      'User Guide': theme === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-800',
      'Billing': theme === 'dark' ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || (theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-800');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`text-lg transition-colors duration-300 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>{t('catalog.loadingServices')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>{t('catalog.errorLoading')}</h2>
          <p className={`text-lg mb-6 transition-colors duration-300 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>{error}</p>
          <Button onClick={fetchCatalogItems}>
            {t('catalog.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {t('catalog.title')}
          </h1>
          <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {t('catalog.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder={t('catalog.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full px-6 py-4 text-lg rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500'
              }`}
              style={{
                paddingLeft: '1.5rem',
                paddingRight: '3rem',
                textAlign: i18n.language === 'he' || i18n.language === 'ar' ? 'right' : 'left'
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
              <svg className={`h-6 w-6 transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
              {displayedCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
                    filters.category === category
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white shadow-blue-600/25'
                        : 'bg-blue-600 text-white shadow-blue-600/25'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-50 hover:shadow-lg border border-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Show More/Less Categories Button */}
            {allCategories.length > 12 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:shadow-lg border border-slate-600'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:shadow-lg border border-slate-200'
                  }`}
                >
                  {showAllCategories ? t('common.showLess') : `${t('common.showMore')} (${allCategories.length - 12})`}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Services Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.343A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.562M15 6.343A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.562" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {t('catalog.noServices')}
            </h3>
            <p className={`transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {t('catalog.noServicesDescription')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: ServiceNowCatalogItem) => (
              <Card key={item.sys_id} className={`h-full flex flex-col transition-all duration-300 hover:shadow-lg ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-750/90' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}>
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className={`text-lg font-semibold mb-2 line-clamp-2 text-left transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {item.name}
                      </CardTitle>
                      {item.category && (
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium max-w-56 truncate ml-2 mt-3 ${
                          getCategoryColor(item.category)
                        }`} title={item.category}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-300 mt-3 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                        : 'bg-gradient-to-br from-blue-600 to-blue-700'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className={`text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 text-left flex-1 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {item.short_description || item.description ? (
                      <span dangerouslySetInnerHTML={{
                        __html: renderHtmlContent(item.short_description || item.description || '')
                      }} />
                    ) : (
                      t('common.noDescription')
                    )}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Link
                      to={`/catalog/${item.sys_id}`}
                      className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {t('catalog.requestService')}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 