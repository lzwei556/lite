import { toPascal } from 'ts-case-convert';

export const direction = {
  Axial: { key: 'axial', label: 'label.axis.axial', abbr: 'label.axis.axial.abbr', sort: 2 },
  Vertical: {
    key: 'vertical',
    label: 'label.axis.vertical',
    abbr: 'label.axis.vertical.abbr',
    sort: 1
  },
  Horizontal: {
    key: 'horizontal',
    label: 'label.axis.horizontal',
    abbr: 'label.axis.horizontal.abbr',
    sort: 0
  }
} as const;

export const options = [direction.Axial, direction.Vertical, direction.Horizontal];

export type Option = (typeof direction)[keyof typeof direction];
export type Key = Option['key'];

export const getByKey = (key: Key): Option => {
  return direction[toPascal(key) as keyof typeof direction];
};
