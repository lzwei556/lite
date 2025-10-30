import { toSnake } from 'ts-case-convert';
import { ProcessTypeKey, processTypes } from './constants';
import { transformSnake2Dot } from '../utils';

export const getOptions = () =>
  processTypes.map(({ key }) => ({ value: key, label: Key.getLabel(key) }));

const PREFIX = 'process.type.';

export const Key = {
  getLabel: (key: ProcessTypeKey) => {
    const type = get(key);
    return type ? `${PREFIX}${transformSnake2Dot(toSnake(type.label))}` : `${key}`;
  },
  getSourceType: (key: ProcessTypeKey) => {
    return get(key)?.sourceType;
  },
  getParameters: (key: ProcessTypeKey) => {
    return get(key)?.parameters ?? [];
  }
};

const get = (key: ProcessTypeKey) => {
  return processTypes.find((type) => type.key === key) || null;
};
