import * as VD from '../vibration-direction';
import * as Axis from '../axis';
import { Field } from 'types/entity';

type NumericPosition = { index: number };

type Inclination = NumericPosition & { tower_install_angle: number };

type TopInclination = Inclination & {
  tower_install_height: number;
};

type BaseInclination = Inclination & {
  tower_base_radius: number;
};

export type Corrosion = NumericPosition & {
  initial_thickness_enabled: boolean;
  initial_thickness: number;
  critical_thickness_enabled: boolean;
  critical_thickness: number;
  corrosion_rate_short_term: number;
  corrosion_rate_long_term: number;
};

export type VibrationDirection = { [Key in VD.Key]: Axis.Key };

export type Vibration = { index: string } & VibrationDirection;

export type AxisWithVibrationDirection = Omit<Axis.Option, 'label'> & {
  label: Axis.Option['label'] | VD.Option['abbr'];
};

export type Entity = NumericPosition | TopInclination | BaseInclination | Corrosion | Vibration;

const positionField: Field<Entity> = {
  name: 'index',
  label: 'monitoirng.point.position',
  description: 'index.desc',
  type: 'number'
};
const towerInstallAngle: Field<Entity> = {
  name: 'tower_install_angle',
  label: 'tower.install.angle',
  description: 'tower.install.angle.desc',
  unit: '°',
  type: 'number'
};
const towerInstallHeight: Field<Entity> = {
  name: 'tower_install_height',
  label: 'tower.install.height',
  description: 'tower.install.height.desc',
  unit: 'm',
  type: 'number'
};
const towerBaseRadius: Field<Entity> = {
  name: 'tower_base_radius',
  label: 'tower.base.radius',
  description: 'tower.base.radius.desc',
  unit: 'm',
  type: 'number'
};
const initialThickness: Field<Entity> = {
  name: 'initial_thickness',
  label: 'initial.thickness',
  description: 'initial.thickness.desc',
  unit: 'mm',
  type: 'number-switcher'
};
const criticalThickness: Field<Entity> = {
  name: 'critical_thickness',
  label: 'critical.thickness',
  description: 'critical.thickness.desc',
  unit: 'mm',
  type: 'number-switcher'
};
const corrosionRateShortTerm: Field<Entity> = {
  name: 'corrosion_rate_short_term',
  label: 'corrosion.rate.short.term',
  description: 'corrosion.rate.short.term.desc',
  translatingUnit: 'UNIT_DAY',
  type: 'number',
  defaultValue: 30
};
const corrosionRateLongTerm: Field<Entity> = {
  name: 'corrosion_rate_long_term',
  label: 'corrosion.rate.long.term',
  description: 'corrosion.rate.long.term.desc',
  translatingUnit: 'UNIT_DAY',
  type: 'number',
  defaultValue: 365
};
const options = Axis.Options.map((opt) => ({ label: opt.label, value: opt.key }));
const axial: Field<Entity> = {
  label: 'direction.axial',
  name: 'axial',
  description: 'axial.desc',
  options,
  type: 'enum',
  defaultValue: Axis.Z.key
};
const vertical: Field<Entity> = {
  label: 'direction.vertical',
  name: 'vertical',
  description: 'vertical.desc',
  options,
  type: 'enum',
  defaultValue: Axis.Y.key
};
const horizontal: Field<Entity> = {
  label: 'direction.horizontal',
  name: 'horizontal',
  description: 'horizontal.desc',
  options,
  type: 'enum',
  defaultValue: Axis.X.key
};

export const CorrosionConfig = {
  InitialThickness: initialThickness,
  CriticalThickness: criticalThickness,
  Fields: [
    positionField,
    initialThickness,
    criticalThickness,
    corrosionRateShortTerm,
    corrosionRateLongTerm
  ]
};

export const Config = {
  PositionField: positionField,

  Vibration: {
    Fields: [{ ...positionField, type: 'string' }, axial, vertical, horizontal] as Field<Entity>[]
  },
  TopInclination: [positionField, towerInstallAngle, towerInstallHeight],
  BaseInclination: [positionField, towerInstallAngle, towerBaseRadius]
};
