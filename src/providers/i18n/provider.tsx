import React from 'react';
import intl from 'react-intl-universal';
import { detectLanuage, initLocales, LanguageCode } from './language';
import { Dayjs } from 'utils';
import { useLanguagesServerConfig } from 'config';

type I18nContextProps = {
  languages: LanguageCode[];
  language: LanguageCode;
  changeLanguage: (code: LanguageCode) => void;
};

const Context = React.createContext<I18nContextProps>({} as I18nContextProps);

export function useI18n() {
  return React.useContext(Context);
}

export const I18nProvider = ({ children }: { children?: React.ReactNode }) => {
  const languagesFromServer = useLanguagesServerConfig()
  const [languages, setLanguages] = React.useState<LanguageCode[]>([]);
  const [language, setLanguage] = React.useState<LanguageCode>(LanguageCode.EN);
  const [locales, setLocales] = React.useState<any>({});
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      const { languages, locales } = await initLocales(languagesFromServer);
      const currentLocale = detectLanuage(languages) as LanguageCode;
      setLanguages(languages);
      setLanguage(currentLocale);
      setLocales(locales);
      await intl.init({
        currentLocale,
        locales
      });
      Dayjs.dayjs.locale(currentLocale);
      setReady(true);
    };
    init();
  }, [languagesFromServer]);

  const changeLanguage = async (code: LanguageCode) => {
    try {
      await intl.init({
        currentLocale: code,
        locales
      });
      Dayjs.dayjs.locale(code);
      setLanguage(code);
      localStorage.setItem('language', code);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  if (!ready) return null;

  return (
    <Context.Provider value={{ language, languages, changeLanguage }}>{children}</Context.Provider>
  );
};
