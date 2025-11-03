/**
 * Language selector component with flag icons
 */

import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { SUPPORTED_LANGUAGES } from '@/i18n/types';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    document.documentElement.lang = languageCode;
  };

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language);
  const displayCode = currentLang?.code === 'pt-BR' ? 'PT' : currentLang?.code.toUpperCase();

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[85px] gap-1.5 text-sm font-medium">
        <span>{displayCode}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
