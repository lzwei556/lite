import { toSnake } from 'ts-case-convert';
import { pickOptionsFromNumericEnum, transformSnake2Dot } from 'utils';

enum Type {
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
  key: Type;
  label: string;
  // description: string;
  suggestion: string;
};
const PREFIX = 'fault.type';

const getLabel = (enumKey: string) => {
  return `${PREFIX}.${transformSnake2Dot(toSnake(enumKey))}`;
};

const get = (key: Type): Config => {
  const label = getLabel(Type[key]);
  return { key, label, suggestion: `${label}.suggestion` };
};

export type FaultType = Type;

export const FaultTypeConfig = {
  get,
  getLabel,
  options: pickOptionsFromNumericEnum(Type, PREFIX)
};
