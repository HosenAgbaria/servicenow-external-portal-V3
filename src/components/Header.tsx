import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { useUIStore } from '../stores/uiStore';
import { useCatalogStore } from '../stores/catalogStore';
import { apiService } from '../services/apiService';
import { LanguageSwitcher } from './LanguageSwitcher';
import MinistryLogo from '../assets/Ministry_of_Finance_logo.svg';
import type { ServiceNowCatalogItem } from '../types';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();
  const { items, setItems } = useCatalogStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ServiceNowCatalogItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.serviceCatalog'), href: '/catalog' },
    { name: t('navigation.knowledgeBase'), href: '/knowledge' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700/60' 
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={MinistryLogo} 
                alt="Ministry of Finance" 
                className="h-10 w-auto transition-all duration-300"
              />
              <span className={`text-xl font-bold transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {t('header.brandName')}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? theme === 'dark'
                        ? 'text-blue-400 bg-blue-900/50 border border-blue-700/50'
                        : 'text-blue-700 bg-blue-50 border border-blue-200/50'
                      : theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Search Input */}
              <div className="relative hidden md:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder={t('header.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className={`w-80 px-6 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className={`h-5 w-5 mx-3 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                aria-label={t('header.themeToggle')}
              >
                {theme === 'dark' ? (
                  // Sun icon for dark mode
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  // Moon icon for light mode
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-xl transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                aria-label="Toggle mobile menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className={`md:hidden border-t transition-all duration-300 ${
              theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="relative md:hidden">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder={t('header.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className={`w-full px-6 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <svg className={`h-5 w-5 mx-3 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? theme === 'dark'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-900'
                        : theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};