/**
 * TypeScript types for i18n
 * Provides type-safety and autocomplete for translation keys
 */

export type SupportedLanguage = 'pt-BR' | 'en';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'pt-BR';
