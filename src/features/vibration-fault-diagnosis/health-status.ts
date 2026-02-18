import { toSnake } from 'ts-case-convert';
import { iterate, transformSnake2Dot } from 'utils';

export enum Value {
  Healthy = 0,
  Warning = 1,
  Critical = 2,
  Fault = 3
}

const color = {
  [Value.Healthy]: [40, 167, 69],
  [Value.Warning]: [255, 193, 7],
  [Value.Critical]: [254, 109, 44],
  [Value.Fault]: [255, 0, 0]
} as const;

const range = {
  [Value.Healthy]: '>= 85',
  [Value.Warning]: '85 - 70',
  [Value.Critical]: '70 - 50',
  [Value.Fault]: '< 50'
} as const;

export type HealthStatus = {
  key: Value;
  label: string;
  color: (typeof color)[keyof typeof color];
  range: string;
};

export const Key = {
  get: (key: Value): HealthStatus => {
    const PREFIX = 'health.status.';
    const label = `${PREFIX}${transformSnake2Dot(toSnake(Value[key]))}`;
    return { key, label, color: color[key], range: range[key] };
  }
};

export const getOptions = (): HealthStatus[] => {
  return iterate(Value).map(Key.get);
};
