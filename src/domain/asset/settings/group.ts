export enum MotorSettingsGroup {
  Motor = 1,
  Bearing,
  Algorithm,
  Velocity
}

export type GroupField = {
  group?: MotorSettingsGroup;
};

export const getGroupLabel = (type: MotorSettingsGroup): string =>
  `${MotorSettingsGroup[type]}.parameters`.toLowerCase();
