import React, { createContext, useState, useContext, useEffect } from 'react';

export const LANGUAGES = {
  english: 'en-US' as 'en-US',
  chinese: 'zh-CN' as 'zh-CN'
};

export const LanguageOptions = [
  { key: LANGUAGES.chinese, label: '中文' },
  { key: LANGUAGES.english, label: 'EN' }
];

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

export const THEMES = {
  light: 'light' as 'light',
  dark: 'dark' as 'dark'
};

export type Theme = typeof THEMES[keyof typeof THEMES];

export const ThemeOptions = [
  { value: THEMES.light, label: 'theme.light' },
  { value: THEMES.dark, label: 'theme.dark' }
];

type LocalProviderProps = {
  language: Language;
  theme: Theme;
  setLocale: React.Dispatch<React.SetStateAction<{ language: Language; theme: Theme }>>;
};

const LocaleContext = createContext<LocalProviderProps>({} as LocalProviderProps);

export function useLocaleContext() {
  return useContext(LocaleContext);
}

export const LocaleProvider = ({ children }: { children?: React.ReactNode }) => {
  const locale = useLocaleProvider();
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

function useLocaleProvider() {
  const uaLang = window.navigator.language;
  const localLang = localStorage.getItem('lang');
  const initialLang =
    (localLang || (process.env.REACT_APP_LOCALE ?? uaLang)) !== LANGUAGES.chinese
      ? LANGUAGES.english
      : LANGUAGES.chinese;
  const [locale, setLocale] = useState<Omit<LocalProviderProps, 'setLocale'>>({
    language: initialLang,
    theme: (localStorage.getItem('theme') as Theme) ?? THEMES.light
  });
  useEffect(() => {
    localStorage.setItem('lang', locale.language);
  }, [locale.language]);
  useEffect(() => {
    localStorage.setItem('theme', locale.theme);
  }, [locale.theme]);

  return { ...locale, setLocale };
}
