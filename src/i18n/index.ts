/**
 * i18n configuration with react-i18next
 * Handles language detection, loading, and fallbacks
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import commonPtBR from './locales/pt-BR/common.json';
import sleepPtBR from './locales/pt-BR/sleep.json';
import caffeinePtBR from './locales/pt-BR/caffeine.json';
import todoPtBR from './locales/pt-BR/todo.json';
import blogPtBR from './locales/pt-BR/blog.json';
import authPtBR from './locales/pt-BR/auth.json';

import commonEN from './locales/en/common.json';
import sleepEN from './locales/en/sleep.json';
import caffeineEN from './locales/en/caffeine.json';
import todoEN from './locales/en/todo.json';
import blogEN from './locales/en/blog.json';
import authEN from './locales/en/auth.json';

import { DEFAULT_LANGUAGE } from './types';

const resources = {
  'pt-BR': {
    common: commonPtBR,
    sleep: sleepPtBR,
    caffeine: caffeinePtBR,
    todo: todoPtBR,
    blog: blogPtBR,
    auth: authPtBR,
  },
  en: {
    common: commonEN,
    sleep: sleepEN,
    caffeine: caffeineEN,
    todo: todoEN,
    blog: blogEN,
    auth: authEN,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: 'common',
    ns: ['common', 'sleep', 'caffeine', 'todo', 'blog', 'auth'],
    
    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nima-language',
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
