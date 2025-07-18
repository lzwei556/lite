import { round } from 'lodash';
import { dayjs } from './dayjsUtils';
import { Language } from '../localeProvider';

export const getFilename = (res: any, identifier?: number) => {
  let filename = `${dayjs().format('YYYY-MM-DD HH:mm:ss')}.json`;
  const dispos = res.headers['content-disposition'];
  if (dispos) {
    const disposParts = dispos.split(';');
    if (disposParts && disposParts.length > 1) {
      const path = disposParts[1];
      const pathParts = path.split('filename=');
      if (pathParts && pathParts.length > 1) {
        filename = decodeURI(identifier ? `${identifier}_${pathParts[1]}` : pathParts[1]);
      }
    }
  }
  return filename;
};

export function toMac(mac: string) {
  if (mac.length === 12) {
    return mac.replace(/\w(?=(\w{2})+$)/g, '$&-');
  }
  return mac;
}

export function getValue(value: number | null | undefined, unit?: string) {
  if (Number.isNaN(value) || value === null || value === undefined) return '-';
  return `${value}${unit ?? ''}`;
}

export function roundValue(value: number, precision?: number) {
  if (value === null || value === undefined) return Number.NaN;
  if (Number.isNaN(value) || value === 0) return value;
  return round(value, precision ?? 3);
}

export function getDisplayName({
  name,
  lang,
  suffix
}: {
  name: string;
  lang: Language;
  suffix?: string;
}) {
  const zh = lang === 'zh-CN';
  const braceLeft = zh ? '（' : ' (';
  const braceRight = zh ? '）' : ')';
  if (suffix) {
    return `${name}${braceLeft}${suffix}${braceRight}`;
  } else {
    return name;
  }
}

export function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + '...' : text;
}

export function formatNumericData(data: string | number) {
  if (typeof data === 'number') {
    return roundValue(data);
  }
  return data;
}

export const transform2Phrase = (sentence: string) => {
  return isSentence(sentence) ? sentence.slice(0, sentence.length - 1) : sentence;
};

const isSentence = (str: string) => {
  const pos = str.indexOf('.');
  return pos > -1 && str.length > 1 && str.length === pos + 1;
};
