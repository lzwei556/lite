const object = {
  X: { key: 'x', value: 0, label: 'AXIS_X' },
  Y: { key: 'y', value: 1, label: 'AXIS_Y' },
  Z: { key: 'z', value: 2, label: 'AXIS_Z' }
} as const;

export type AxisOption = (typeof object)[keyof typeof object];
export type AxisKey = AxisOption['key'];

export const Axis = {
  ...object,
  Options: [object.X, object.Y, object.Z],
  get: (key: AxisKey): AxisOption => object[key.toUpperCase() as keyof typeof object]
};
