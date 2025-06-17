'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'vtma-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage === 'en' || savedLanguage === 'nl') {
      setLanguageState(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: string): string | string[] => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Fallback to Dutch if key not found
        value = translations.nl;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = (value as Record<string, unknown>)[fallbackKey];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
          }
        }
        break;
      }
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    if (Array.isArray(value)) {
      return value as string[];
    }
    
    console.warn(`Translation key not found: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}