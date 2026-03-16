import { pickOptionsFromNumericEnum } from 'utils';
import { Field } from '../types';

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

export type RotationSpeed = { rotation_speed: number };
export const rotationSpeed: Field<MotorSettings> = {
  label: 'asset.rotation.speed',
  name: 'rpm',
  description: 'asset.rotation.speed.desc',
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

export const motorFields: Field<MotorSettings>[] = [
  rotationSpeed,
  {
    label: 'asset.motor.env.band',
    name: 'env_band',
    description: 'env.band.desc',
    type: 'number-array',
    unit: 'Hz',
    defaultValue: [100, 1000]
  },
  {
    label: 'asset.motor.power.freq',
    name: 'power_freq',
    description: 'power.freq.desc',
    type: 'number',
    unit: 'Hz',
    defaultValue: 50
  },
  {
    label: 'asset.motor.gear.teeth',
    name: 'gear_teeth',
    description: 'gear.teeth.desc',
    type: 'number',
    defaultValue: 30
  },
  {
    label: 'asset.motor.bearing.n-balls',
    name: 'bearing.n_balls',
    description: 'bearing.n.balls.desc',
    type: 'number',
    defaultValue: 8,
    group: 'diagnosis.bearing.parameters'
  },
  {
    label: 'asset.motor.bearing.d',
    name: 'bearing.d',
    description: 'bearing.d.desc',
    type: 'number',
    unit: 'mm',
    defaultValue: 6.75,
    group: 'diagnosis.bearing.parameters'
  },
  {
    label: 'asset.motor.bearing.big-d',
    name: 'bearing.big_d',
    description: 'bearing.big.d.desc',
    type: 'number',
    unit: 'mm',
    defaultValue: 29.05,
    group: 'diagnosis.bearing.parameters'
  },
  {
    label: 'asset.motor.bearing.theta',
    name: 'bearing.theta',
    description: 'bearing.theta.desc',
    type: 'number',
    unit: 'rad',
    defaultValue: 0,
    group: 'diagnosis.bearing.parameters'
  },
  {
    label: 'asset.motor.motor-poles',
    name: 'motor.poles',
    description: 'motor.poles.desc',
    type: 'number',
    defaultValue: 4
  },
  {
    label: 'asset.motor.motor-slip',
    name: 'motor.slip',
    description: 'motor.slip.desc',
    type: 'number',
    defaultValue: 0.02
  },
  {
    label: 'diagnosis.fault.sensitivity',
    name: 'fault_sensitivity',
    description: 'diagnosis.fault.sensitivity.desc',
    type: 'enum',
    options: pickOptionsFromNumericEnum(FaultSensitivity, 'fault.sensitivity'),
    defaultValue: 2,
    group: 'diagnosis.algorithm.parameters'
  },
  {
    label: 'diagnosis.severity.sensitivity',
    name: 'severity_sensitivity',
    description: 'diagnosis.severity.sensitivity.desc',
    type: 'enum',
    options: pickOptionsFromNumericEnum(SeveritySensitivity, 'diagnosis.severity.sensitivity'),
    defaultValue: 2,
    group: 'diagnosis.algorithm.parameters'
  },
  {
    label: 'diagnosis.vel-base.vel-base-1-10x',
    name: 'vel_base.vel_base_1_10X',
    description: 'diagnosis.vel-base.vel-base-1-10x.desc',
    type: 'number-array',
    defaultValue: [105, 90, 85, 85, 85, 85, 80, 80, 80, 80],
    group: 'diagnosis.velocity.parameters'
  },
  {
    label: 'diagnosis.vel-base.non-int-base-0-10x',
    name: 'vel_base.vel_non_int_base_0_10X',
    description: 'diagnosis.vel-base.non-int-base-0-10x.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 80,
    group: 'diagnosis.velocity.parameters'
  },
  {
    label: 'diagnosis.vel-base.vel-base-10-40x',
    name: 'vel_base.vel_base_10_40X',
    description: 'diagnosis.vel-base.vel-base-10-40x.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 75,
    group: 'diagnosis.velocity.parameters'
  },
  {
    label: 'diagnosis.vel-base.vel-base-40-99x',
    name: 'vel_base.vel_base_40_99X',
    description: 'diagnosis.vel-base.vel-base-40-99x.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 70,
    group: 'diagnosis.velocity.parameters'
  },
  {
    label: 'diagnosis.vel-base.vel-base-bearing',
    name: 'vel_base.vel_base_bearing',
    description: 'diagnosis.vel-base.vel-base-bearing.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 80,
    group: 'diagnosis.velocity.parameters'
  },
  {
    label: 'diagnosis.vel-base.vel-base-100hz',
    name: 'vel_base.vel_base_100Hz',
    description: 'diagnosis.vel-base.vel-base-100hz.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 80,
    group: 'diagnosis.velocity.parameters'
  },
  {
    label: 'diagnosis.vel-base.vel-base-mfb',
    name: 'vel_base.vel_base_mfb',
    description: 'diagnosis.vel-base.vel-base-mfb.desc',
    type: 'number',
    unit: 'dB',
    defaultValue: 80,
    group: 'diagnosis.velocity.parameters'
  }
];
