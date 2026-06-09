export const X = { key: 'x', value: 0, label: 'AXIS_X' } as const;
export const Y = { key: 'y', value: 1, label: 'AXIS_Y' } as const;
export const Z = { key: 'z', value: 2, label: 'AXIS_Z' } as const;
export const Options = [X, Y, Z];
export type Option = (typeof Options)[0];
export type Key = Option['key'];

export const get = (key: Key): Option | undefined => {
  if (key === 'x') {
    return X;
  } else if (key === 'y') {
    return Y;
  } else if (key === 'z') {
    return Z;
  }
};
