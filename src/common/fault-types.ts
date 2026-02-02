import { toSnake } from 'ts-case-convert';
import { pickOptionsFromNumericEnum, transformSnake2Dot } from 'utils';

export enum Value {
  ShaftWear = 1001,
  BearingLooseness = 1002,
  BearingMisalignment = 1003,
  BearingAssemblyIssues = 1004,
  RotorImbalance = 1101,
  ShaftMisalignment = 1102,
  ShaftBendingFault = 1103,
  MechanicalLooseness = 1104,
  Bpfo = 1201,
  Bpfi = 1202,
  Bsf = 1203,
  Ftf = 1204
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
    const label = getLabel(Value[key]);
    // return { key, label, description: `${label}.desc`, suggestion: `${label}.suggestion` };
    return { key, label, suggestion: `${label}.suggestion` };
  }
};

export const options = pickOptionsFromNumericEnum(Value, PREFIX);

export const getLabel = (enumKey: string) => {
  return `${PREFIX}.${transformSnake2Dot(toSnake(enumKey))}`;
};
