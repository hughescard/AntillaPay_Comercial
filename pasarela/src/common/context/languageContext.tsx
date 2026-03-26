'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '@/common/i18n/i18n'; 

export type Language = 'en' | 'es' | 'chs';

interface ContextProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
}

const GlobalContext = createContext<ContextProps>({
  currentLang: 'es', 
  setLang: () => {},
});

export const useLanguage = () => useContext(GlobalContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  
  const contextValue = useMemo(() => ({
    currentLang: (i18n.language as Language) || 'es',
    setLang: (lang: Language) => {
      i18n.changeLanguage(lang);
    },
  }), [i18n]); 

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};