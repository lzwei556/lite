import { toPascal } from 'ts-case-convert';

const direction = {
  Axial: { key: 'axial', label: 'axis.axial', abbr: 'axis.axial.abbr' },
  Vertical: { key: 'vertical', label: 'axis.vertical', abbr: 'axis.vertical.abbr' },
  Horizontal: { key: 'horizontal', label: 'axis.horizontal', abbr: 'axis.horizontal.abbr' }
} as const;

export const OPTIONS = [direction.Axial, direction.Vertical, direction.Horizontal];

export type Option = (typeof direction)[keyof typeof direction];
export type Key = Option['key'];

export const getByKey = (key: Key): Option => {
  return direction[toPascal(key) as keyof typeof direction];
};
