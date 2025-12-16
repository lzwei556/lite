import { Field } from '../types';
import { pickOptionsFromNumericEnum } from '../utils';

export type MotorSettings = {
  bearing_type: BearingType;
  contact_angle: number;
  drive_end_bearing_model: string;
  grid_frequency: number;
  pairs_of_motor_poles: number;
  pitch_circle_diameter: number;
  motor_type: MotorTypeValue;
  mounting: Mounting;
  nominal_power: number;
  non_drive_end_bearing_model: string;
  rolling_elements_num: number;
  rolling_elements_diameter: number;
  rotation_mode: RotationMode;
  rotor_count: number;
  variable_frequency_drive: boolean;
} & RotationSpeed;

enum MotorTypeValue {
  AC = 'AC',
  DC = 'DC'
}
const motorTypeOptions = [
  { label: MotorTypeValue['AC'], value: MotorTypeValue.AC },
  { label: MotorTypeValue['DC'], value: MotorTypeValue.DC }
];

enum BearingType {
  Roller = 1,
  Journal
}
const bearingTypeOptions = pickOptionsFromNumericEnum(BearingType, 'motor.bearing.type');

enum Mounting {
  Horizontal = 1,
  Vertical
}
const mountingTypeOptions = pickOptionsFromNumericEnum(Mounting, 'motor.mounting');

enum RotationMode {
  Inner = 'inner',
  Outer = 'outer'
}
const rotationModeOptions = [
  { label: RotationMode['Inner'], value: RotationMode.Inner },
  { label: RotationMode['Outer'], value: RotationMode.Outer }
];

export type RotationSpeed = { rotation_speed: number };
export const rotationSpeed: Field<MotorSettings> = {
  label: 'rotation.speed',
  name: 'rotation_speed',
  description: 'rotation.speed.desc',
  type: 'number',
  unit: 'rpm',
  defaultValue: 1000
};

export const motorFields: Field<MotorSettings>[] = [
  {
    label: 'motor.type',
    name: 'motor_type',
    description: 'motor.type.desc',
    options: motorTypeOptions,
    type: 'enum',
    defaultValue: MotorTypeValue.AC
  },
  rotationSpeed,
  {
    label: 'motor.variable.frequency.drive',
    name: 'variable_frequency_drive',
    description: 'variable.frequency.drive.desc',
    type: 'boolean',
    options: [
      // @ts-ignore
      { label: 'yes', value: true },
      // @ts-ignore
      { label: 'no', value: false }
    ],
    defaultValue: true
  },
  {
    label: 'motor.nominal.power',
    name: 'nominal_power',
    description: 'nominal.power.desc',
    type: 'number',
    unit: 'kW',
    defaultValue: 380
  },
  {
    label: 'motor.mounting',
    name: 'mounting',
    description: 'mounting.desc',
    options: mountingTypeOptions,
    type: 'enum',
    defaultValue: Mounting.Horizontal
  },
  {
    label: 'motor.bearing.type',
    name: 'bearing_type',
    description: 'bearing.type.desc',
    options: bearingTypeOptions,
    type: 'enum',
    defaultValue: BearingType.Roller
  },
  {
    label: 'motor.drive.end.bearing.model',
    name: 'drive_end_bearing_model',
    description: 'drive.end.bearing.model.desc',
    type: 'string'
  },
  {
    label: 'motor.non.drive.end.bearing.model',
    name: 'non_drive_end_bearing_model',
    description: 'non.drive.end.bearing.model.desc',
    type: 'string'
  },
  {
    label: 'motor.rolling.elements.num',
    name: 'rolling_elements_num',
    description: 'rolling.elements.num.desc',
    type: 'number',
    defaultValue: 10
  },
  {
    label: 'motor.rolling.elements.diameter',
    name: 'rolling_elements_diameter',
    description: 'rolling.elements.diameter.desc',
    type: 'number',
    unit: 'mm',
    defaultValue: 100
  },
  {
    label: 'motor.pitch.circle.diameter',
    name: 'pitch_circle_diameter',
    description: 'pitch.circle.diameter.desc',
    type: 'number',
    unit: 'mm',
    defaultValue: 100
  },
  {
    label: 'motor.contact.angle',
    name: 'contact_angle',
    description: 'contact.angle.desc',
    type: 'number',
    unit: '°',
    defaultValue: 2
  },
  {
    label: 'motor.rotation.mode',
    name: 'rotation_mode',
    description: 'rotation.mode.desc',
    options: rotationModeOptions,
    type: 'enum',
    defaultValue: RotationMode.Inner
  }
];
