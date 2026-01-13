import { toSnake } from 'ts-case-convert';
import { pickOptionsFromNumericEnum, transformSnake2Dot } from 'utils';

export enum Value {
  Wear = 1001,
  Loose = 1002,
  NonCenter = 1003,
  Mounting = 1004
}

type FaultType = {
  key: Value;
  label: string;
  // description: string;
  suggestion: string;
};
const PREFIX = 'fault.type';
export const Key = {
  get: (key: Value): FaultType => {
    const label = `${PREFIX}.${transformSnake2Dot(toSnake(Value[key]))}`;
    // return { key, label, description: `${label}.desc`, suggestion: `${label}.suggestion` };
    return { key, label, suggestion: `${label}.suggestion` };
  }
};

export const options = pickOptionsFromNumericEnum(Value, PREFIX);
