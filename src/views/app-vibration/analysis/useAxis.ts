import React from 'react';

export type Axis = { label: string; value: number; selected?: boolean; key: 'x' | 'y' | 'z' };

export const AXIS_OPTIONS: Axis[] = [
  { label: 'axis.axial', value: 0, selected: true, key: 'x' },
  { label: 'axis.vertical', value: 1, key: 'y' },
  { label: 'axis.horizontal', value: 2, key: 'z' }
];

export function useAxis() {
  const [axies, setAxies] = React.useState<Axis[]>(AXIS_OPTIONS);
  return { axis: axies.find((a) => !!a.selected) ?? axies[0], axies, setAxies };
}
