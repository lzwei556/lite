import { Option } from '../common';
type NumericEnum = { [key: string | number]: number | string };

export const pickOptionsFromNumericEnum = (em: NumericEnum, labelPrefix?: string) => {
  const options: Option[] = [];
  for (const key in em) {
    if (Number.isInteger(Number(key))) {
      const optionLabel = convertCamelCase(em[key] as string).toLocaleLowerCase();
      const optionValue = Number(key);
      options.push({ label: `${labelPrefix}${optionLabel}`, value: optionValue });
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
  return `${labelPrefix}${convertCamelCase(_key)}`;
};

function convertCamelCase(str: string) {
  return str.replaceAll(/[A-Z]/g, (i) => '.' + i.toLowerCase());
}
