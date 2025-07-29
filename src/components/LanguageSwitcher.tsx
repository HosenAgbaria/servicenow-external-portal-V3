import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../stores/uiStore';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { theme } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    
    // Set document direction for RTL languages
    if (languageCode === 'he' || languageCode === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = languageCode;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = languageCode;
    }
    
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          theme === 'dark'
            ? 'text-slate-300 hover:text-white hover:bg-slate-800'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Language"
      >
        {/* <span className="text-lg">{currentLanguage.flag}</span> */}
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 ${
          theme === 'dark' 
            ? 'bg-slate-800 border border-slate-600' 
            : 'bg-white border border-slate-200'
        }`}>
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${
                  language.code === currentLanguage.code
                    ? theme === 'dark'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-900'
                    : theme === 'dark'
                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {/* <span className="text-lg">{language.flag}</span> */}
                <span className="flex-1 text-left">{language.name}</span>
                {language.code === currentLanguage.code && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 