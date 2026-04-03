import { Field } from 'types';
import { pickOptionsFromNumericEnum } from 'utils/enum';
import { GroupField, MotorSettingsGroup } from './group';

export type MotorSettings = {
  bearing: { n_balls: number; d: number; big_d: number; theta: number };
  contact_angle: number;
  env_band: [min: number, max: number];
  gear_teeth: number;
  motor: {
    poles: number;
    slip: number;
  };
  pitch_circle_diameter: number;
  power_freq: number;
  rpm: number;
  rotation_speed: number;
  rolling_elements_num: number;
  rolling_elements_diameter: number;
  rotation_mode: RotationMode;
  vel_base: {
    vel_base_1_10X: [
      base1: number,
      base2: number,
      base3: number,
      base4: number,
      base5: number,
      base6: number,
      base7: number,
      base8: number,
      base9: number,
      base10: number
    ];
    vel_non_int_base_0_10X: number;
    vel_base_10_40X: number;
    vel_base_40_99X: number;
    vel_base_bearing: number;
    vel_base_100Hz: number;
    vel_base_mfb: number;
  };
  fault_sensitivity: number;
  severity_sensitivity: number;
} & RotationSpeed;

enum RotationMode {
  Inner = 'inner',
  Outer = 'outer'
}
// const rotationModeOptions = [
//   { label: RotationMode['Inner'], value: RotationMode.Inner },
//   { label: RotationMode['Outer'], value: RotationMode.Outer }
// ];

export type MotorSettingsField = Omit<Field<MotorSettings>, 'group'> & GroupField;

export type RotationSpeed = { rotation_speed: number };
export const rotationSpeed: MotorSettingsField = {
  label: 'rotation.speed',
  name: 'rpm',
  description: 'rotation.speed.desc',
  type: 'number',
  unit: 'rpm',
  defaultValue: 745
};

enum FaultSensitivity {
  Low = 1,
  Medium,
  High
}

enum SeveritySensitivity {
  Low = 1,
  Medium,
  High
}

export const motorFields: MotorSettingsField[] = [
  rotationSpeed,
  {
    label: 'motor.env.band',
    name: 'env_band',
    description: 'env.band.desc',
    type: 'number-array',
    unit: 'Hz',
    defaultValue: [100, 1000]
  },
  {
    label: 'motor.power.freq',
    name: 'power_freq',
    description: 'power.freq.desc',
    type: 'number',
    unit: 'Hz',
    defaultValue: 50
  },
  {
    label: 'motor.gear.teeth',
    name: 'gear_teeth',
    description: 'gear.teeth.desc',
    type: 'number',
    defaultValue: 30
  },
  {
    label: 'motor.bearing.n.balls',
    name: 'bearing.n_balls',
    description: 'bearing.n.balls.desc',
    type: 'number',
    defaultValue: 8,
    group: MotorSettingsGroup.Bearing
  },
  {
    label: 'motor.bearing.d',
    name: 'bearing.d',
    description: 'bearing.d.desc',
    type: 'number',
    unit: 'mm',
    defaultValue: 6.75,
    group: MotorSettingsGroup.Bearing
  },
  {
    label: 'motor.bearing.big.d',
    name: 'bearing.big_d',
    description: 'bearing.big.d.desc',
    type: 'number',
    unit: 'mm',
    defaultValue: 29.05,
    group: MotorSettingsGroup.Bearing
  },
  {
    label: 'motor.bearing.theta',
    name: 'bearing.theta',
    description: 'bearing.theta.desc',
    type: 'number',
    unit: 'rad',
    defaultValue: 0,
    group: MotorSettingsGroup.Bearing
  },
  {
    label: 'motor.motor.poles',
    name: 'motor.poles',
    description: 'motor.poles.desc',
    type: 'number',
    defaultValue: 4
  },
  {
    label: 'motor.motor.slip',
    name: 'motor.slip',
    description: 'motor.slip.desc',
    type: 'number',
    defaultValue: 0.02
  },
  {
    label: 'motor.fault.sensitivity',
    name: 'fault_sensitivity',
    description: 'motor.fault.sensitivity.desc',
    type: 'enum',
    options: pickOptionsFromNumericEnum(FaultSensitivity, 'fault.sensitivity'),
    defaultValue: 2,
    group: MotorSettingsGroup.Algorithm
  },
  {
    label: 'motor.severity.sensitivity',
    name: 'severity_sensitivity',
    description: 'motor.severity.sensitivity.desc',
    type: 'enum',
    options: pickOptionsFromNumericEnum(SeveritySensitivity, 'severity.sensitivity'),
    defaultValue: 2,
    group: MotorSettingsGroup.Algorithm
  },
  // {
  //   label: 'motor.rolling.elements.num',
  //   name: 'rolling_elements_num',
  //   description: 'rolling.elements.num.desc',
  //   type: 'number',
  //   defaultValue: 10
  // },
  // {
  //   label: 'motor.rolling.elements.diameter',
  //   name: 'rolling_elements_diameter',
  //   description: 'rolling.elements.diameter.desc',
  //   type: 'number',
  //   unit: 'mm',
  //   defaultValue: 100
  // },
  // {
  //   label: 'motor.pitch.circle.diameter',
  //   name: 'pitch_circle_diameter',
  //   description: 'pitch.circle.diameter.desc',
  //   type: 'number',
  //   unit: 'mm',
  //   defaultValue: 100
  // },
  // {
  //   label: 'motor.contact.angle',
  //   name: 'contact_angle',
  //   description: 'contact.angle.desc',
  //   type: 'number',
  //   unit: '°',
  //   defaultValue: 2
  // },
  // {
  //   label: 'motor.rotation.mode',
  //   name: 'rotation_mode',
  //   description: 'rotation.mode.desc',
  //   options: rotationModeOptions,
  //   type: 'enum',
  //   defaultValue: RotationMode.Inner
  // },
  {
    label: 'motor.vel.base.vel.base.1.10x',
    name: 'vel_base.vel_base_1_10X',
    description: 'vel.base.vel.base.1.10x.desc',
    type: 'number-array',
    defaultValue: [105, 90, 85, 85, 85, 85, 80, 80, 80, 80],
    group: MotorSettingsGroup.Velocity
  },
  {
    label: 'motor.vel.base.vel.non.int.base.0.10x',
    name: 'vel_base.vel_non_int_base_0_10X',
    description: 'vel.base.vel.non.int.base.0.10x.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 80,
    group: MotorSettingsGroup.Velocity
  },
  {
    label: 'motor.vel.base.vel.base.10.40x',
    name: 'vel_base.vel_base_10_40X',
    description: 'vel.base.vel.base.10.40x.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 75,
    group: MotorSettingsGroup.Velocity
  },
  {
    label: 'motor.vel.base.vel.base.40.99x',
    name: 'vel_base.vel_base_40_99X',
    description: 'vel.base.vel.base.40.99x.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 70,
    group: MotorSettingsGroup.Velocity
  },
  {
    label: 'motor.vel.base.vel.base.bearing',
    name: 'vel_base.vel_base_bearing',
    description: 'vel.base.vel.base.bearing.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 80,
    group: MotorSettingsGroup.Velocity
  },
  {
    label: 'motor.vel.base.vel.base.100.hz',
    name: 'vel_base.vel_base_100Hz',
    description: 'vel.base.vel.base.100hz.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 80,
    group: MotorSettingsGroup.Velocity
  },
  {
    label: 'motor.vel.base.vel.base.mfb',
    name: 'vel_base.vel_base_mfb',
    description: 'vel.base.vel.base.mfb.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 80,
    group: MotorSettingsGroup.Velocity
  }
];
