import { Field } from '../types';
import { MonitoringPointRow } from './types';

export const MONITORING_POINT = 'monitoring.point';
export const MONITORING_POINT_LIST = `monitoring.points`;
export const INVALID_MONITORING_POINT = `monitoring.points.abnormal`;

export const AXIS = {
  X: { key: 'x', value: 0, label: 'label.axis.x' },
  Y: { key: 'y', value: 1, label: 'label.axis.y' },
  Z: { key: 'z', value: 2, label: 'label.axis.z' }
} as const;

export type AxisKey = (typeof AXIS)[keyof typeof AXIS]['key'];

export const AXIS_OPTIONS = [AXIS.X, AXIS.Y, AXIS.Z];

export const AXIS_ALIAS = {
  Axial: { key: 'axial', label: 'label.axis.axial', abbr: 'label.axis.axial.abbr' },
  Vertical: { key: 'vertical', label: 'label.axis.vertical', abbr: 'label.axis.vertical.abbr' },
  Horizontal: {
    key: 'horizontal',
    label: 'label.axis.horizontal',
    abbr: 'label.axis.horizontal.abbr'
  }
} as const;

type MonitoringPointAttrsField = Field<NonNullable<MonitoringPointRow['attributes']>>;

export const TowerInstallAngle: MonitoringPointAttrsField = {
  name: 'tower_install_angle',
  label: 'asset.tower.install.angle',
  description: 'asset.tower.install.angle.desc',
  unit: '°',
  type: 'number'
};
export const TowerInstallHeight: MonitoringPointAttrsField = {
  name: 'tower_install_height',
  label: 'asset.tower.install.height',
  description: 'asset.tower.install.height.desc',
  unit: 'm',
  type: 'number'
};
export const TowerBaseRadius: MonitoringPointAttrsField = {
  name: 'tower_base_radius',
  label: 'asset.tower.base.radius',
  description: 'asset.tower.base.radius.desc',
  unit: 'm',
  type: 'number'
};
export const InitialThickness: MonitoringPointAttrsField = {
  name: 'initial_thickness',
  label: 'corrosion.initial.thickness',
  description: 'corrosion.initial.thickness.desc',
  unit: 'mm',
  type: 'number'
};
export const CriticalThickness: MonitoringPointAttrsField = {
  name: 'critical_thickness',
  label: 'corrosion.critical.thickness',
  description: 'corrosion.critical.thickness.desc',
  unit: 'mm',
  type: 'number'
};
export const CorrosionRateShortTerm: MonitoringPointAttrsField = {
  name: 'corrosion_rate_short_term',
  label: 'SETTING_CORROSION_RATE_SHORT',
  description: 'SETTING_CORROSION_RATE_SHORT_DESC',
  unit: 'label.unit.day',
  type: 'number'
};
export const CorrosionRateLongTerm: MonitoringPointAttrsField = {
  name: 'corrosion_rate_long_term',
  label: 'SETTING_CORROSION_RATE_LONG',
  description: 'SETTING_CORROSION_RATE_LONG_DESC',
  unit: 'label.unit.day',
  type: 'number'
};
