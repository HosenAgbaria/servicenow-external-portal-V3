import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../stores/uiStore';
import { useCatalogStore } from '../stores/catalogStore';
import { apiService } from '../services/apiService';
import type { ServiceNowCatalogItem } from '../types';

export const HomePage: React.FC = () => {
  const { theme } = useUIStore();
  const { items, setItems } = useCatalogStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ServiceNowCatalogItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();

  // Fetch catalog items for search
  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        const response = await apiService.getCatalogItems({ limit: 100 });
        if (response.success && response.data) {
          const catalogItems = response.data.data || [];
          setItems(catalogItems);
        }
      } catch (error) {
        console.error('Failed to fetch catalog items for search:', error);
      }
    };

    fetchCatalogItems();
  }, [setItems]);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = items.filter((item: ServiceNowCatalogItem) => {
      const searchTerm = query.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.short_description?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.category?.toLowerCase().includes(searchTerm)
      );
    });

    setSearchResults(filtered.slice(0, 5)); // Show top 5 results
    setShowDropdown(filtered.length > 0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (item: ServiceNowCatalogItem) => {
    navigate(`/catalog/${item.sys_id}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };

  // Popular searches
  const popularSearches = [
    t('home.popularSearches.passwordReset'),
    t('home.popularSearches.softwareInstallation'),
    t('home.popularSearches.accessRequest'),
    t('home.popularSearches.hardwareSupport'),
    t('home.popularSearches.emailSetup')
  ];

  const quickLinks = [
    {
      title: t('home.quickAccessPortal.serviceCatalog.title'),
      description: t('home.quickAccessPortal.serviceCatalog.description'),
      href: '/catalog',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: t('home.quickAccessPortal.knowledgeBase.title'),
      description: t('home.quickAccessPortal.knowledgeBase.description'),
      href: '/knowledge',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: t('home.quickAccessPortal.myRequests.title'),
      description: t('home.quickAccessPortal.myRequests.description'),
      href: '/requests',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    }
  ];

  // Helper function to safely render HTML content
  const renderHtmlContent = (htmlContent: string) => {
    if (!htmlContent) return 'No description available';
    
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

  const featuredArticles = [
    {
      title: t('home.featuredResources.userGuide.subtitle'),
      description: t('home.featuredResources.userGuide.description'),
      category: t('home.featuredResources.userGuide.title'),
      readTime: t('home.featuredResources.userGuide.readTime'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: t('home.featuredResources.security.subtitle'),
      description: t('home.featuredResources.security.description'),
      category: t('home.featuredResources.security.title'),
      readTime: t('home.featuredResources.security.readTime'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: t('home.featuredResources.technical.subtitle'),
      description: t('home.featuredResources.technical.description'),
      category: t('home.featuredResources.technical.title'),
      readTime: t('home.featuredResources.technical.readTime'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    }
  ];

  const testServiceNowConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        alert('✅ ServiceNow API connection is working!');
      } else {
        alert('❌ ServiceNow API connection failed');
      }
    } catch (error) {
      alert('❌ ServiceNow API connection failed: ' + error);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/20'
    }`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
            : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800'
        }`}>
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Finance-themed decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Currency symbols */}
            <div className={`absolute top-10 left-10 text-6xl font-bold transition-all duration-300 ${
              theme === 'dark' ? 'text-white/5' : 'text-white/5'
            }`}>$</div>
            <div className={`absolute top-20 right-20 text-4xl font-bold transition-all duration-300 ${
              theme === 'dark' ? 'text-white/5' : 'text-white/5'
            }`}>€</div>
            <div className={`absolute bottom-20 left-20 text-5xl font-bold transition-all duration-300 ${
              theme === 'dark' ? 'text-white/5' : 'text-white/5'
            }`}>£</div>
            <div className={`absolute bottom-10 right-10 text-3xl font-bold transition-all duration-300 ${
              theme === 'dark' ? 'text-white/5' : 'text-white/5'
            }`}>¥</div>
            
            {/* Chart-like elements */}
            <div className={`absolute top-32 left-1/4 w-16 h-16 border-l-2 border-t-2 rounded-tl-lg transition-all duration-300 ${
              theme === 'dark' ? 'border-white/10' : 'border-white/10'
            }`}></div>
            <div className={`absolute top-40 left-1/4 w-12 h-12 border-l-2 border-t-2 rounded-tl-lg transition-all duration-300 ${
              theme === 'dark' ? 'border-white/10' : 'border-white/10'
            }`}></div>
            <div className={`absolute top-48 left-1/4 w-20 h-20 border-l-2 border-t-2 rounded-tl-lg transition-all duration-300 ${
              theme === 'dark' ? 'border-white/10' : 'border-white/10'
            }`}></div>
            
            <div className={`absolute bottom-32 right-1/4 w-20 h-20 border-l-2 border-t-2 rounded-tl-lg transition-all duration-300 ${
              theme === 'dark' ? 'border-white/10' : 'border-white/10'
            }`}></div>
            <div className={`absolute bottom-40 right-1/4 w-16 h-16 border-l-2 border-t-2 rounded-tl-lg transition-all duration-300 ${
              theme === 'dark' ? 'border-white/10' : 'border-white/10'
            }`}></div>
            <div className={`absolute bottom-48 right-1/4 w-12 h-12 border-l-2 border-t-2 rounded-tl-lg transition-all duration-300 ${
              theme === 'dark' ? 'border-white/10' : 'border-white/10'
            }`}></div>
            
            {/* Abstract geometric shapes */}
            <div className={`absolute top-1/4 left-1/3 w-32 h-32 rounded-full blur-3xl transition-all duration-300 ${
              theme === 'dark' ? 'bg-white/5' : 'bg-white/5'
            }`}></div>
            
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl transition-all duration-300 ${
              theme === 'dark' ? 'bg-white/5' : 'bg-white/5'
            }`}></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.description')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder={t('home.search.placeholder')}
                  className={`w-full px-8 py-6 text-lg rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-slate-900 bg-white/95 focus:bg-white'
                      : 'text-slate-900 bg-white/95 focus:bg-white'
                  }`}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={{
                    paddingLeft: '2rem',
                    paddingRight: '3.5rem',
                    textAlign: i18n.language === 'he' || i18n.language === 'ar' ? 'right' : 'left'
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                  <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && (
                  <div className={`absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border ${
                    theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-200'
                  }`}>
                    {isLoading ? (
                      <div className="p-4 text-center">Loading...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">No results found.</div>
                    ) : (
                      searchResults.map((item, index) => (
                        <div
                          key={item.sys_id}
                          className={`p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
                            index === 0 ? 'rounded-t-lg' : index === searchResults.length - 1 ? 'rounded-b-lg' : ''
                          }`}
                          onClick={() => handleResultClick(item)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate text-left">{item.name}</h3>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 text-left">
                                {item.short_description || item.description ? (
                                  <span dangerouslySetInnerHTML={{ 
                                    __html: renderHtmlContent(item.short_description || item.description || '') 
                                  }} />
                                ) : (
                                  t('common.noDescription')
                                )}
                              </p>
                              {item.category && (
                                <span className="inline-block mt-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Popular Searches */}
            <div className="max-w-2xl mx-auto mb-8">
              <p className={`text-sm text-center mb-3 transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-300' : 'text-white'
              }`}>
                {t('home.popularSearches.title')}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/catalog">
                <button className={`px-6 py-3 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-slate-900 hover:bg-slate-100 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                  {t('home.quickLinks.browseServices')}
                </button>
              </Link>
              <Link to="/knowledge">
                <button className={`px-6 py-3 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                  {t('home.quickLinks.knowledgeBase')}
                </button>
              </Link>
              {/* <button 
                className={`px-6 py-3 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-emerald-600 text-white hover:bg-emerald-700 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                onClick={testServiceNowConnection}
              >
                {t('home.testApiConnection')}
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600' 
                : 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300'
            }`}>
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {t('home.quickAccessPortal.title')}
            </h2>
            <p className={`text-lg max-w-3xl mx-auto transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {t('home.quickAccessPortal.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Catalog Card */}
            <Link to="/catalog" className="group">
              <div className={`relative h-full p-8 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600' 
                  : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl'
              }`}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl"></div>
                
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 group-hover:from-blue-500 group-hover:to-blue-600' 
                      : 'bg-gradient-to-br from-blue-600 to-blue-700 group-hover:from-blue-500 group-hover:to-blue-600'
                  }`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {t('home.quickAccessPortal.serviceCatalog.title')}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {t('home.quickAccessPortal.serviceCatalog.description')}
                  </p>
                </div>
              </div>
            </Link>

            {/* Knowledge Base Card */}
            <Link to="/knowledge" className="group">
              <div className={`relative h-full p-8 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600' 
                  : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl'
              }`}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-xl"></div>
                
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 group-hover:from-emerald-500 group-hover:to-emerald-600' 
                      : 'bg-gradient-to-br from-emerald-600 to-emerald-700 group-hover:from-emerald-500 group-hover:to-emerald-600'
                  }`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {t('home.quickAccessPortal.knowledgeBase.title')}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {t('home.quickAccessPortal.knowledgeBase.description')}
                  </p>
                </div>
              </div>
            </Link>

            {/* My Requests Card */}
            <Link to="/requests" className="group">
              <div className={`relative h-full p-8 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600' 
                  : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl'
              }`}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-t-xl"></div>
                
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-slate-500 group-hover:to-slate-600' 
                      : 'bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-slate-500 group-hover:to-slate-600'
                  }`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {t('home.quickAccessPortal.myRequests.title')}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {t('home.quickAccessPortal.myRequests.description')}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600' 
                : 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300'
            }`}>
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {t('home.featuredResources.title')}
            </h2>
            <p className={`text-lg max-w-3xl mx-auto transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {t('home.featuredResources.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div key={index} className="group">
                <div className={`relative h-full p-8 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600' 
                    : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl'
                }`}>
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
                    article.category === 'User Guide' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                    article.category === 'Security' ? 'bg-gradient-to-r from-red-600 to-red-700' :
                    'bg-gradient-to-r from-emerald-600 to-emerald-700'
                  }`}></div>
                  
                  <div className="flex flex-col h-full">
                    {/* Header with category and read time */}
                    <div className="flex items-center justify-between mb-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                        article.category === 'User Guide' ? 
                          (theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800') :
                        article.category === 'Security' ? 
                          (theme === 'dark' ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800') :
                          (theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800')
                      }`}>
                        {article.category}
                      </span>
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {article.readTime}
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 mb-6 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      article.category === 'User Guide' ? 
                        (theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600') :
                      article.category === 'Security' ? 
                        (theme === 'dark' ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-600') :
                        (theme === 'dark' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                    }`}>
                      {article.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {article.title}
                      </h3>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 line-clamp-3 ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        <span dangerouslySetInnerHTML={{ 
                          __html: renderHtmlContent(article.description) 
                        }} />
                      </p>
                    </div>
                    
                    {/* Footer with read more */}
                    <div className={`flex items-center justify-between mt-6 pt-4 border-t transition-colors duration-300 ${
                      theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
                    }`}>
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {t('home.featuredResources.readArticle')}
                      </span>
                      <svg className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};