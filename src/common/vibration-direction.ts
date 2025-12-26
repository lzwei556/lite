import { toPascal } from 'ts-case-convert';

export const direction = {
  Axial: { key: 'axial', label: 'axis.axial', abbr: 'axis.axial.abbr', sort: 0 },
  Vertical: { key: 'vertical', label: 'axis.vertical', abbr: 'axis.vertical.abbr', sort: 1 },
  Horizontal: { key: 'horizontal', label: 'axis.horizontal', abbr: 'axis.horizontal.abbr', sort: 2 }
} as const;

export const options = [direction.Axial, direction.Vertical, direction.Horizontal];

export type Option = (typeof direction)[keyof typeof direction];
export type Key = Option['key'];

export const getByKey = (key: Key): Option => {
  return direction[toPascal(key) as keyof typeof direction];
};
