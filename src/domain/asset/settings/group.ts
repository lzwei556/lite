export enum SettingsGroup {
  Motor = 1,
  Bearing,
  Algorithm,
  Velocity
}

export type GroupField = {
  group?: SettingsGroup;
};

export const getGroupLabel = (type: SettingsGroup): string =>
  `${SettingsGroup[type]}.parameters`.toLowerCase();
