import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { lang, switchLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
      <Globe className="w-3.5 h-3.5 text-stone-500" />
      <select
        value={lang}
        onChange={(e) => switchLanguage(e.target.value)}
        className="bg-transparent border-none text-xs font-medium text-stone-800 focus:outline-hidden cursor-pointer"
      >
        <option value="en">English</option>
        <option value="te">తెలుగు (Telugu)</option>
        <option value="hi">हिंदी (Hindi)</option>
      </select>
    </div>
  );
};
