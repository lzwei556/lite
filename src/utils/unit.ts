import { Language } from '../localeProvider';

export const getPluralUnitInEnglish = (amount: number, unit: string, language: Language) => {
  if (language === 'en-US') {
    return amount > 1 ? `${unit}s` : unit;
  } else {
    return unit;
  }
};
