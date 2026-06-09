export const Axial = {
  key: 'axial',
  label: 'axis.axial',
  abbr: 'axis.axial.abbr',
  sort: 2
} as const;
export const Vertical = {
  key: 'vertical',
  label: 'axis.vertical',
  abbr: 'axis.vertical.abbr',
  sort: 1
} as const;
export const Horizontal = {
  key: 'horizontal',
  label: 'axis.horizontal',
  abbr: 'axis.horizontal.abbr',
  sort: 0
} as const;

export const Options = [Axial, Vertical, Horizontal];

export type Option = (typeof Options)[0];
export type Key = Option['key'];

export const get = (key: Key): Option | undefined => {
  if (key === 'axial') {
    return Axial;
  } else if (key === 'vertical') {
    return Vertical;
  } else if (key === 'horizontal') {
    return Horizontal;
  }
};
