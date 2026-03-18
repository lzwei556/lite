import { Locale } from 'antd/es/locale';
import zhCN from 'antd/es/locale/zh_CN';
import zhTW from 'antd/es/locale/zh_TW';
import enUS from 'antd/es/locale/en_US';
import ruRU from 'antd/es/locale/ru_RU';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import zh_CN from 'locales/zh-CN.json';
import zh_TW from 'locales/zh-TW.json';
import en from 'locales/en.json';
import ru from 'locales/ru.json';
import { ENV } from 'utils/env';

export enum LanguageCode {
  SC = 'zh-CN',
  TC = 'zh-TW',
  EN = 'en',
  RU = 'ru'
}

type Lanuage = {
  code: LanguageCode;
  label: string;
  abbr: string;
  locele: any;
  antdLocale: Locale;
  category?: 'chinese';
  localeCodeOfECharts: 'ZH' | 'EN';
};

const lanuageTable: Record<LanguageCode, Omit<Lanuage, 'code'>> = {
  [LanguageCode.SC]: {
    label: '简体中文',
    abbr: 'ZH',
    locele: zh_CN,
    antdLocale: zhCN,
    category: 'chinese',
    localeCodeOfECharts: 'ZH'
  },
  [LanguageCode.TC]: {
    label: '繁體中文',
    abbr: 'TC',
    locele: zh_TW,
    antdLocale: zhTW,
    category: 'chinese',
    localeCodeOfECharts: 'ZH'
  },
  [LanguageCode.EN]: {
    label: 'English',
    abbr: 'EN',
    locele: en,
    antdLocale: enUS,
    localeCodeOfECharts: 'EN'
  },
  [LanguageCode.RU]: {
    label: 'Русский',
    abbr: 'RU',
    locele: ru,
    antdLocale: ruRU,
    localeCodeOfECharts: 'EN'
  }
};

export const getLanguage = (code: LanguageCode): Lanuage => {
  const entry = lanuageTable[code];
  return { code, ...entry };
};

export const isLanguageChinese = (code: LanguageCode) => getLanguage(code).category === 'chinese';

export const languageCodes = Object.values(LanguageCode);

export const detectLanuage = (languages: string[]) => {
  const localLang = localStorage.getItem('language');
  const envLang = ENV.locale;
  const browserLang = window.navigator.language;
  if (localLang && languages.includes(localLang)) {
    return localLang;
  }
  if (envLang && languages.includes(envLang)) {
    return envLang;
  }
  return languages[0] ?? browserLang;
};

export async function initLocales(languagesFromServer?: LanguageCode[]) {
  const serverLanguages = languagesFromServer?.filter((l) => languageCodes.includes(l)) ?? [];
  const languages = serverLanguages.length > 0 ? serverLanguages : languageCodes;
  const locales: any = {};
  for (const lang of languages) {
    const frontendLocale = getLanguage(lang).locele;
    const serverLocale = await getI18nFiles(lang);
    locales[lang] = mergeLocale(frontendLocale, serverLocale);
  }

  return { languages, locales };
}

function mergeLocale(frontend: any, server: any) {
  if (!server) return frontend;
  const result = { ...frontend };
  for (const key in server) {
    if (key in frontend && typeof server[key] === 'string') {
      result[key] = server[key];
    }
  }
  return result;
}

const getI18nFiles = async (lang: string) => {
  try {
    const res = await fetch(`/res/${lang}.json`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch {
    console.log('Failed to load i18n files');
    return null;
  }
};
