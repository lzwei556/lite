export const axisObject = {
  X: { key: 'x', value: 0, label: 'label.axis.x' },
  Y: { key: 'y', value: 1, label: 'label.axis.y' },
  Z: { key: 'z', value: 2, label: 'label.axis.z' }
} as const;

export const options = [axisObject.X, axisObject.Y, axisObject.Z];

export type Option = (typeof axisObject)[keyof typeof axisObject];
export type Key = Option['key'];

export const getByKey = (key: Key): Option => {
  return axisObject[key.toUpperCase() as keyof typeof axisObject];
};
