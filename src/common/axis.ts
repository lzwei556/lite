const axis = {
  X: { key: 'x', value: 0, label: 'AXIS_X' },
  Y: { key: 'y', value: 1, label: 'AXIS_Y' },
  Z: { key: 'z', value: 2, label: 'AXIS_Z' }
} as const;

export const OPTIONS = [axis.X, axis.Y, axis.Z];

export type Option = (typeof axis)[keyof typeof axis];
export type Key = Option['key'];

export const getByKey = (key: Key): Option => {
  return axis[key.toUpperCase() as keyof typeof axis];
};
