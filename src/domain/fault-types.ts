import { toSnake } from 'ts-case-convert';
import { pickOptionsFromNumericEnum, transformSnake2Dot } from 'utils';

export enum Enum {
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

type Config = {
  key: Enum;
  label: string;
  // description: string;
  suggestion: string;
};
const PREFIX = 'fault.type';

export const getLabel = (enumKey: string) => {
  return `${PREFIX}.${transformSnake2Dot(toSnake(enumKey))}`;
};

export const get = (key: Enum): Config => {
  const label = getLabel(Enum[key]);
  return { key, label, suggestion: `${label}.suggestion` };
};

export const options = pickOptionsFromNumericEnum(Enum, PREFIX)

