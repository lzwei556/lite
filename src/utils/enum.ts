import { toSnake } from 'ts-case-convert';
import { Option } from '../common';
import { transformSnake2Dot } from './format';
type NumericEnum = { [key: string | number]: number | string };

export const pickOptionsFromNumericEnum = (em: NumericEnum, labelPrefix?: string) => {
  const options: Option[] = [];
  for (const key in em) {
    if (Number.isInteger(Number(key))) {
      const optionLabel = transformSnake2Dot(toSnake(em[key] as string));
      const optionValue = Number(key);
      options.push({ label: `${labelPrefix}.${optionLabel}`, value: optionValue });
    }
  }
  return options;
};

export const getKeyByValue = (em: NumericEnum, value: number, labelPrefix?: string) => {
  let _key: string = `${value}`;
  for (const key in em) {
    if (Number.isNaN(Number(key)) && em[key] === value) {
      _key = key;
    }
  }
  return `${labelPrefix}.${transformSnake2Dot(toSnake(_key))}`;
};
