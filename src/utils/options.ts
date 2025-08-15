import { Option } from '../common';
import { getAttrValue } from './object';

export const getOptionByValue = (options: Option[], value?: string | number | boolean) => {
  if (value != null) {
    return options.find((opt) => opt.value === value);
  }
  return undefined;
};

export const getOptionLabelByValue = (options: Option[], value?: string | number | boolean) => {
  const option = getOptionByValue(options, value);
  return getAttrValue(option, 'label') as string;
};
