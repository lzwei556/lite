import { MonitoringPointSettingsFieldConfig } from './settings';
import { MPTypeConfig, Type } from './type-config';
import { transform, transform2PostDTO } from './types';

export * from './type-config';
export type { TMonitoringPoint } from './types';
export const OMonitoringPoint = {
  transform,
  transform2PostDTO,
  Settings: MonitoringPointSettingsFieldConfig,
  Type: {
    ...Type,
    ...MPTypeConfig
  },
  get types() {
    return Object.values(Type).filter((v) => typeof v === 'number') as Type[];
  }
};
