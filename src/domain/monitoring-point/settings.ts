import { Axis, AxisKey, AxisOption } from 'domain/axis';
import {
  VibrationDirection,
  VibrationDirectionKey,
  VibrationDirectionOption
} from 'domain/vibration-direction';
import _ from 'lodash';
import React from 'react';
import { Field } from 'types/entity';

export type VibrationDirectionSettings = { [Key in VibrationDirectionKey]: AxisKey };
export type AxisWithVibrationDirectionLabel = Omit<AxisOption, 'label'> & {
  label: AxisOption['label'] | VibrationDirectionOption['abbr'];
};

type NumericPosition = { index: number };

type InclinationSettings = NumericPosition & { tower_install_angle: number };

type TopInclinationSettings = InclinationSettings & {
  tower_install_height: number;
};

type BaseInclinationSettings = InclinationSettings & {
  tower_base_radius: number;
};

export type CorrosionMonitoringPointSettings = NumericPosition & {
  initial_thickness_enabled: boolean;
  initial_thickness: number;
  critical_thickness_enabled: boolean;
  critical_thickness: number;
  corrosion_rate_short_term: number;
  corrosion_rate_long_term: number;
};

type VibrationSettings = { index: string } & VibrationDirectionSettings;

export type MonitoringPointSettings =
  | NumericPosition
  | TopInclinationSettings
  | BaseInclinationSettings
  | CorrosionMonitoringPointSettings
  | VibrationSettings;

const positionField: Field<MonitoringPointSettings> = {
  name: 'index',
  label: 'monitoirng.point.position',
  description: 'index.desc',
  type: 'number'
};
const towerInstallAngle: Field<MonitoringPointSettings> = {
  name: 'tower_install_angle',
  label: 'tower.install.angle',
  description: 'tower.install.angle.desc',
  unit: '°',
  type: 'number'
};
const towerInstallHeight: Field<MonitoringPointSettings> = {
  name: 'tower_install_height',
  label: 'tower.install.height',
  description: 'tower.install.height.desc',
  unit: 'm',
  type: 'number'
};
const towerBaseRadius: Field<MonitoringPointSettings> = {
  name: 'tower_base_radius',
  label: 'tower.base.radius',
  description: 'tower.base.radius.desc',
  unit: 'm',
  type: 'number'
};
const initialThickness: Field<MonitoringPointSettings> = {
  name: 'initial_thickness',
  label: 'initial.thickness',
  description: 'initial.thickness.desc',
  unit: 'mm',
  type: 'number-switcher'
};
const criticalThickness: Field<MonitoringPointSettings> = {
  name: 'critical_thickness',
  label: 'critical.thickness',
  description: 'critical.thickness.desc',
  unit: 'mm',
  type: 'number-switcher'
};
const corrosionRateShortTerm: Field<MonitoringPointSettings> = {
  name: 'corrosion_rate_short_term',
  label: 'corrosion.rate.short.term',
  description: 'corrosion.rate.short.term.desc',
  translatingUnit: 'UNIT_DAY',
  type: 'number',
  defaultValue: 30
};
const corrosionRateLongTerm: Field<MonitoringPointSettings> = {
  name: 'corrosion_rate_long_term',
  label: 'corrosion.rate.long.term',
  description: 'corrosion.rate.long.term.desc',
  translatingUnit: 'UNIT_DAY',
  type: 'number',
  defaultValue: 365
};
const options = Axis.Options.map((opt) => ({ label: opt.label, value: opt.key }));
const axial: Field<MonitoringPointSettings> = {
  label: 'direction.axial',
  name: 'axial',
  description: 'axial.desc',
  options,
  type: 'enum',
  defaultValue: Axis.Z.key
};
const vertical: Field<MonitoringPointSettings> = {
  label: 'direction.vertical',
  name: 'vertical',
  description: 'vertical.desc',
  options,
  type: 'enum',
  defaultValue: Axis.Y.key
};
const horizontal: Field<MonitoringPointSettings> = {
  label: 'direction.horizontal',
  name: 'horizontal',
  description: 'horizontal.desc',
  options,
  type: 'enum',
  defaultValue: Axis.X.key
};

export const MonitoringPointSettingsFieldConfig = {
  PositionField: positionField,
  Corrosion: {
    InitialThickness: initialThickness,
    CriticalThickness: criticalThickness,
    Fields: [
      positionField,
      initialThickness,
      criticalThickness,
      corrosionRateShortTerm,
      corrosionRateLongTerm
    ]
  },
  Vibration: {
    Fields: [
      { ...positionField, type: 'string' },
      axial,
      vertical,
      horizontal
    ] as Field<MonitoringPointSettings>[],
    useAxisWithVibrationDirection: (attrs?: VibrationDirectionSettings) => {
      const options: AxisWithVibrationDirectionLabel[] = _.orderBy(
        Axis.Options.map((opt) => {
          const direction = getVibrationDirectionByAxisKey(opt.key, attrs);
          return { ...opt, direction };
        }),
        (option) => option.direction?.sort ?? option.value,
        'desc'
      ).map(({ direction, ...rest }) => ({
        ...rest,
        label: direction ? direction.abbr : rest.label
      }));
      const [axis, setAxis] = React.useState(options[0]);
      return { axis, setAxis, options };
    }
  },
  TopInclination: [positionField, towerInstallAngle, towerInstallHeight],
  BaseInclination: [positionField, towerInstallAngle, towerBaseRadius]
};

const getVibrationDirectionByAxisKey = (
  axisKey: AxisKey,
  attrs?: VibrationDirectionSettings
): VibrationDirectionOption | undefined => {
  let key: VibrationDirectionKey;
  if (attrs) {
    for (key in attrs) {
      const _axisKey = attrs[key];
      if (_axisKey === axisKey) {
        return VibrationDirection.get(key);
      }
    }
  }
};
