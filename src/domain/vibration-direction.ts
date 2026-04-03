import { toPascal } from 'ts-case-convert';

const direction = {
  Axial: { key: 'axial', label: 'axis.axial', abbr: 'axis.axial.abbr', sort: 2 },
  Vertical: { key: 'vertical', label: 'axis.vertical', abbr: 'axis.vertical.abbr', sort: 1 },
  Horizontal: { key: 'horizontal', label: 'axis.horizontal', abbr: 'axis.horizontal.abbr', sort: 0 }
} as const;

export type VibrationDirectionOption = (typeof direction)[keyof typeof direction];
export type VibrationDirectionKey = VibrationDirectionOption['key'];

export const VibrationDirection = {
  ...direction,
  Options: [direction.Axial, direction.Vertical, direction.Horizontal],
  get: (key: VibrationDirectionKey): VibrationDirectionOption =>
    direction[toPascal(key) as keyof typeof direction]
};
