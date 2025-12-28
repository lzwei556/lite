import { Field } from '../types';
import { MonitoringPointRow } from './types';

export const MONITORING_POINT = 'MONITORING_POINT';
export const MONITORING_POINT_LIST = `MONITORING_POINT_LIST`;
export const INVALID_MONITORING_POINT = `ABNORMAL_MONITORING_POINT`;

export const AXIS = {
  X: { key: 'x', value: 0, label: 'AXIS_X' },
  Y: { key: 'y', value: 1, label: 'AXIS_Y' },
  Z: { key: 'z', value: 2, label: 'AXIS_Z' }
} as const;

export type AxisKey = (typeof AXIS)[keyof typeof AXIS]['key'];

export const AXIS_OPTIONS = [AXIS.X, AXIS.Y, AXIS.Z];

export const AXIS_ALIAS = {
  Axial: { key: 'axial', label: 'axis.axial', abbr: 'axis.axial.abbr' },
  Vertical: { key: 'vertical', label: 'axis.vertical', abbr: 'axis.vertical.abbr' },
  Horizontal: { key: 'horizontal', label: 'axis.horizontal', abbr: 'axis.horizontal.abbr' }
} as const;

type MonitoringPointAttrsField = Field<NonNullable<MonitoringPointRow['attributes']>>;

export const TowerInstallAngle: MonitoringPointAttrsField = {
  name: 'tower_install_angle',
  label: 'tower.install.angle',
  description: 'tower.install.angle.desc',
  unit: '°',
  type: 'number'
};
export const TowerInstallHeight: MonitoringPointAttrsField = {
  name: 'tower_install_height',
  label: 'tower.install.height',
  description: 'tower.install.height.desc',
  unit: 'm',
  type: 'number'
};
export const TowerBaseRadius: MonitoringPointAttrsField = {
  name: 'tower_base_radius',
  label: 'tower.base.radius',
  description: 'tower.base.radius.desc',
  unit: 'm',
  type: 'number'
};
export const InitialThickness: MonitoringPointAttrsField = {
  name: 'initial_thickness',
  label: 'initial.thickness',
  description: 'initial.thickness.desc',
  unit: 'mm',
  type: 'number'
};
export const CriticalThickness: MonitoringPointAttrsField = {
  name: 'critical_thickness',
  label: 'critical.thickness',
  description: 'critical.thickness.desc',
  unit: 'mm',
  type: 'number'
};
export const CorrosionRateShortTerm: MonitoringPointAttrsField = {
  name: 'corrosion_rate_short_term',
  label: 'corrosion.rate.short.term',
  description: 'corrosion.rate.short.term.desc',
  unit: 'UNIT_DAY',
  type: 'number'
};
export const CorrosionRateLongTerm: MonitoringPointAttrsField = {
  name: 'corrosion_rate_long_term',
  label: 'corrosion.rate.long.term',
  description: 'corrosion.rate.long.term.desc',
  unit: 'UNIT_DAY',
  type: 'number'
};
