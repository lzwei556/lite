export const axisObject = {
  X: { key: 'x', value: 0, label: 'AXIS_X' },
  Y: { key: 'y', value: 1, label: 'AXIS_Y' },
  Z: { key: 'z', value: 2, label: 'AXIS_Z' }
} as const;

export const options = [axisObject.X, axisObject.Y, axisObject.Z];

export type Option = (typeof axisObject)[keyof typeof axisObject];
export type Key = Option['key'];

export const getByKey = (key: Key): Option => {
  return axisObject[key.toUpperCase() as keyof typeof axisObject];
};
