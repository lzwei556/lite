import * as VibrationDirection from './vibration-direction';
import * as Axis from './axis';
import { Field } from 'types';
import React from 'react';
import _ from 'lodash';

export type VibrationDirectionAttributes = { [Key in VibrationDirection.Key]: Axis.Key };

export type AxisWithVibrationDirectionLabel = Omit<Axis.Option, 'label'> & {
  label: Axis.Option['label'] | VibrationDirection.Option['abbr'];
};

export const useAxisWithVibrationDirection = (attrs?: VibrationDirectionAttributes) => {
  const options: AxisWithVibrationDirectionLabel[] = _.orderBy(
    Axis.options.map((opt) => {
      const direction = getVibrationDirectionByAxisKey(opt.key, attrs);
      return { ...opt, direction };
    }),
    (option) => option.direction?.sort ?? option.value,
    'desc'
  ).map(({ direction, ...rest }) => ({ ...rest, label: direction ? direction.abbr : rest.label }));
  const [axis, setAxis] = React.useState(options[0]);
  return { axis, setAxis, options };
};

const getVibrationDirectionByAxisKey = (
  axisKey: Axis.Key,
  attrs?: VibrationDirectionAttributes
): VibrationDirection.Option | undefined => {
  let key: VibrationDirection.Key;
  if (attrs) {
    for (key in attrs) {
      const _axisKey = attrs[key];
      if (_axisKey === axisKey) {
        return VibrationDirection.getByKey(key);
      }
    }
  }
};

type NumericPosition = { index: number };

type InclinationAttributes = NumericPosition & { tower_install_angle: number };

type TopInclinationAttributes = InclinationAttributes & {
  tower_install_height: number;
};

type BaseInclinationAttributes = InclinationAttributes & {
  tower_base_radius: number;
};

export type CorrosionAttributes = NumericPosition & {
  initial_thickness_enabled: boolean;
  initial_thickness: number;
  critical_thickness_enabled: boolean;
  critical_thickness: number;
  corrosion_rate_short_term: number;
  corrosion_rate_long_term: number;
};

type VibrationAttributes = { index: string } & VibrationDirectionAttributes;

export type MonitoringPointAttributes =
  | NumericPosition
  | TopInclinationAttributes
  | BaseInclinationAttributes
  | CorrosionAttributes
  | VibrationAttributes;

type FieldWithSource<Src extends string, Entity extends object> = Field<Entity> & { source: Src };

export type AttributesField =
  | FieldWithSource<'position', NumericPosition>
  | FieldWithSource<'top-inclination', TopInclinationAttributes>
  | FieldWithSource<'base-inclination', BaseInclinationAttributes>
  | FieldWithSource<'corrosion', CorrosionAttributes>
  | FieldWithSource<'vibration', VibrationAttributes>;

export const positionField: AttributesField = {
  source: 'position',
  name: 'index',
  label: 'monitoring.point.position',
  description: 'index.desc',
  type: 'number'
};
const towerInstallAngle: AttributesField = {
  source: 'top-inclination',
  name: 'tower_install_angle',
  label: 'asset.tower.install.angle',
  description: 'asset.tower.install.angle.desc',
  unit: '°',
  type: 'number'
};
const towerInstallHeight: AttributesField = {
  source: 'top-inclination',
  name: 'tower_install_height',
  label: 'asset.tower.install.height',
  description: 'asset.tower.install.height.desc',
  unit: 'm',
  type: 'number'
};
const towerBaseRadius: AttributesField = {
  source: 'base-inclination',
  name: 'tower_base_radius',
  label: 'asset.tower.base.radius',
  description: 'asset.tower.base.radius.desc',
  unit: 'm',
  type: 'number'
};
const initialThickness: AttributesField = {
  source: 'corrosion',
  name: 'initial_thickness',
  label: 'corrosion.initial.thickness',
  description: 'corrosion.initial.thickness.desc',
  unit: 'mm',
  type: 'number-switcher'
};
const criticalThickness: AttributesField = {
  source: 'corrosion',
  name: 'critical_thickness',
  label: 'corrosion.critical.thickness',
  description: 'corrosion.critical.thickness.desc',
  unit: 'mm',
  type: 'number-switcher'
};
const corrosionRateShortTerm: AttributesField = {
  source: 'corrosion',
  name: 'corrosion_rate_short_term',
  label: 'SETTING_CORROSION_RATE_SHORT',
  description: 'SETTING_CORROSION_RATE_SHORT_DESC',
  translatingUnit: 'label.unit.day',
  type: 'number',
  defaultValue: 30
};
const corrosionRateLongTerm: AttributesField = {
  source: 'corrosion',
  name: 'corrosion_rate_long_term',
  label: 'SETTING_CORROSION_RATE_LONG',
  description: 'SETTING_CORROSION_RATE_LONG_DESC',
  translatingUnit: 'label.unit.day',
  type: 'number',
  defaultValue: 365
};
const options = Axis.options.map((opt) => ({ label: opt.label, value: opt.key }));
const axial: AttributesField = {
  source: 'vibration',
  label: 'monitoring.point.direction.axial',
  name: 'axial',
  description: 'axial.desc',
  options,
  type: 'enum',
  defaultValue: Axis.axisObject.Z.key
};
const vertical: AttributesField = {
  source: 'vibration',
  label: 'monitoring.point.direction.vertical',
  name: 'vertical',
  description: 'vertical.desc',
  options,
  type: 'enum',
  defaultValue: Axis.axisObject.Y.key
};
const horizontal: AttributesField = {
  source: 'vibration',
  label: 'monitoring.point.direction.horizontal',
  name: 'horizontal',
  description: 'horizontal.desc',
  options,
  type: 'enum',
  defaultValue: Axis.axisObject.X.key
};
export const topInclinationFields: AttributesField[] = [
  positionField,
  towerInstallAngle,
  towerInstallHeight
];
export const baseInclinationFields: AttributesField[] = [
  positionField,
  towerInstallAngle,
  towerBaseRadius
];
export const corrosionFields: AttributesField[] = [
  positionField,
  initialThickness,
  criticalThickness,
  corrosionRateShortTerm,
  corrosionRateLongTerm
];
export const vibrationFields: AttributesField[] = [
  { ...positionField, type: 'string' },
  axial,
  vertical,
  horizontal
];
