import { pickOptionsFromNumericEnum } from 'utils/enum';
import { RotationSpeed } from './motor';
import { Field } from 'types/entity';
import { GroupField } from './group';

const PREFIX = 'asset.parameter';

enum DriveTypeValue {
  IntegralShaft = 1,
  CouplingDrive,
  BeltDrive,
  ChainDrive,
  GearDrive
}
const driveTypeOptions = pickOptionsFromNumericEnum(DriveTypeValue, `${PREFIX}.drive.type`);
type DriveType = { drive_type: DriveTypeValue };

type InputBearing = { input_bearing: number };

type OutputBearing = { output_bearing: number };

enum Direction {
  Horizontal = 1,
  Vertical
}
const shaftOrientationOptions = pickOptionsFromNumericEnum(
  Direction,
  `${PREFIX}.shaft.orientation`
);
type ShaftOrientation = { shaft_orientation: Direction };

enum SupportTypeValue {
  TwoBearings = 1,
  Overhung
}
const supportTypeOptions = pickOptionsFromNumericEnum(SupportTypeValue, `${PREFIX}.support.type`);
type SupportType = { support_type: SupportTypeValue };

enum SetTypeValue {
  DcMotorDcGenerator = 1,
  AcMotorAcGenerator,
  DcMotorAcGenerator,
  AcMotorDcGenerator
}
type SetType = { set_type: SetTypeValue };

enum CompressorTypeValue {
  Centrifugal = 1,
  Screw,
  Axial,
  Scroll,
  Piston
}
type CompressorType = {
  compressor_type: CompressorTypeValue;
};

enum FanTypeValue {
  Centrifugal = 1,
  Axial,
  CrossFlow,
  MixedFlow
}
type FanType = { fan_type: FanTypeValue };

enum BlowerTypeValue {
  Centrifugal = 1,
  Axial,
  MixedFlow,
  Roots,
  Screw
}
type BlowerType = { blower_type: BlowerTypeValue };

enum PumpTypeValue {
  Centrifugal = 1,
  Propeller,
  SlidingVane,
  Screw,
  Lobe,
  Piston
}
type PumpType = { pump_type: PumpTypeValue };

type BladeCount = { blade_count: number };

type VaneCount = { vane_count: number };

type ToothCount = { tooth_count: number };

type LobeCount = { lobe_count: number };

type PistonCount = { piston_count: number };

type CommonSettings = DriveType &
  InputBearing &
  OutputBearing &
  ShaftOrientation &
  SupportType &
  RotationSpeed &
  SetType &
  CompressorType &
  FanType &
  BlowerType &
  PumpType &
  BladeCount &
  VaneCount &
  ToothCount &
  LobeCount &
  PistonCount;

export type MotorAsSettingsField = Omit<Field<CommonSettings>, 'group'> &
  GroupField & {
    visibleWhen?: (values?: {
      pump_type?: PumpTypeValue;
      blower_type?: BlowerTypeValue;
      fan_type?: FanTypeValue;
      compressor_type?: CompressorTypeValue;
    }) => boolean;
  };

const rotationSpeed: MotorAsSettingsField = {
  label: 'rotation.speed',
  name: 'rotation_speed',
  description: 'rotation.speed.desc',
  type: 'number',
  rules: [
    {
      type: 'number',
      min: 0
    },
    { type: 'integer' }
  ]
};

const driveType: MotorAsSettingsField = {
  label: `${PREFIX}.drive.type`,
  name: 'drive_type',
  description: 'drive.type.desc',
  options: driveTypeOptions,
  type: 'enum'
};

const inputBearing: MotorAsSettingsField = {
  label: `${PREFIX}.input.bearing`,
  name: 'input_bearing',
  description: 'input.bearing.desc',
  type: 'string'
};

const outputBearing: MotorAsSettingsField = {
  label: `${PREFIX}.output.bearing`,
  name: 'output_bearing',
  description: 'output.bearing.desc',
  type: 'string'
};

const shaftOrientation: MotorAsSettingsField = {
  label: `${PREFIX}.shaft.orientation`,
  name: 'shaft_orientation',
  description: 'shaft.orientation.desc',
  options: shaftOrientationOptions,
  type: 'enum'
};

const supportType: MotorAsSettingsField = {
  label: `${PREFIX}.support.type`,
  name: 'support_type',
  description: 'support.type.desc',
  options: supportTypeOptions,
  type: 'enum'
};

const setType: MotorAsSettingsField = {
  label: `${PREFIX}.set.type`,
  name: 'set_type',
  description: 'set.type.desc',
  options: pickOptionsFromNumericEnum(SetTypeValue, `${PREFIX}.set.type`),
  type: 'enum',
  defaultValue: SetTypeValue.DcMotorDcGenerator
};

export const compressorType: MotorAsSettingsField = {
  label: `${PREFIX}.compressor.type`,
  name: 'compressor_type',
  description: 'compressor.type.desc',
  options: pickOptionsFromNumericEnum(CompressorTypeValue, `${PREFIX}.compressor.type`),
  type: 'enum',
  defaultValue: CompressorTypeValue.Centrifugal
};

const fanType: MotorAsSettingsField = {
  label: `${PREFIX}.fan.type`,
  name: 'fan_type',
  description: 'fan.type.desc',
  options: pickOptionsFromNumericEnum(FanTypeValue, `${PREFIX}.fan.type`),
  type: 'enum',
  defaultValue: FanTypeValue.Centrifugal
};

export const blowerType: MotorAsSettingsField = {
  label: `${PREFIX}.blower.type`,
  name: 'blower_type',
  description: 'blower.type.desc',
  options: pickOptionsFromNumericEnum(BlowerTypeValue, `${PREFIX}.blower.type`),
  type: 'enum',
  defaultValue: BlowerTypeValue.Centrifugal
};

export const pumpType: MotorAsSettingsField = {
  label: `${PREFIX}.pump.type`,
  name: 'pump_type',
  description: 'pump.type.desc',
  options: pickOptionsFromNumericEnum(PumpTypeValue, `${PREFIX}.pump.type`),
  type: 'enum',
  defaultValue: PumpTypeValue.Centrifugal
};

const bladeCount: MotorAsSettingsField = {
  label: `${PREFIX}.blade.count`,
  name: 'blade_count',
  description: 'blade.count.desc',
  type: 'number',
  rules: [
    {
      type: 'number',
      min: 2
    },
    { type: 'integer' }
  ],
  visibleWhen: (values) => {
    if (!values) {
      return false;
    } else {
      return (
        values.pump_type === PumpTypeValue.Centrifugal ||
        values.pump_type === PumpTypeValue.Propeller ||
        values.blower_type === BlowerTypeValue.Centrifugal ||
        values.blower_type === BlowerTypeValue.Axial ||
        values.blower_type === BlowerTypeValue.MixedFlow ||
        values.blower_type === BlowerTypeValue.Roots ||
        values.fan_type === FanTypeValue.Centrifugal ||
        values.fan_type === FanTypeValue.Axial ||
        values.fan_type === FanTypeValue.CrossFlow ||
        values.fan_type === FanTypeValue.MixedFlow ||
        values.compressor_type === CompressorTypeValue.Centrifugal ||
        values.compressor_type === CompressorTypeValue.Axial ||
        values.compressor_type === CompressorTypeValue.Scroll
      );
    }
  }
};

const vaneCount: MotorAsSettingsField = {
  label: `${PREFIX}.vane.count`,
  name: 'vane_count',
  description: 'vane.count.desc',
  type: 'number',
  rules: [
    {
      type: 'number',
      min: 2
    },
    { type: 'integer' }
  ],
  visibleWhen: (values) => values?.pump_type === PumpTypeValue.SlidingVane
};

const toothCount: MotorAsSettingsField = {
  label: `${PREFIX}.tooth.count`,
  name: 'tooth_count',
  description: 'tooth.count.desc',
  type: 'number',
  rules: [
    {
      type: 'number',
      min: 1
    },
    { type: 'integer' }
  ],
  visibleWhen: (values) => {
    if (!values) {
      return false;
    } else {
      return (
        values.pump_type === PumpTypeValue.Screw ||
        values.blower_type === BlowerTypeValue.Screw ||
        values.compressor_type === CompressorTypeValue.Screw
      );
    }
  }
};

const lobeCount: MotorAsSettingsField = {
  label: `${PREFIX}.lobe.count`,
  name: 'lobe_count',
  description: 'lobe.count.desc',
  type: 'number',
  rules: [
    {
      type: 'number',
      min: 2
    },
    { type: 'integer' }
  ],
  visibleWhen: (values) => values?.pump_type === PumpTypeValue.Lobe
};

const pistonCount: MotorAsSettingsField = {
  label: `${PREFIX}.piston.count`,
  name: 'piston_count',
  description: 'piston.count.desc',
  type: 'number',
  rules: [
    {
      type: 'number',
      min: 1
    },
    { type: 'integer' }
  ],
  visibleWhen: (values) => {
    if (!values) {
      return false;
    } else {
      return (
        values.pump_type === PumpTypeValue.Piston ||
        values.compressor_type === CompressorTypeValue.Piston
      );
    }
  }
};

export const pumpFields: MotorAsSettingsField[] = [
  pumpType,
  shaftOrientation,
  driveType,
  rotationSpeed,
  supportType,
  inputBearing,
  outputBearing,
  bladeCount,
  vaneCount,
  toothCount,
  lobeCount,
  pistonCount
];

export const fanFields: MotorAsSettingsField[] = [
  fanType,
  shaftOrientation,
  driveType,
  rotationSpeed,
  supportType,
  inputBearing,
  outputBearing,
  bladeCount
];

export const blowerFields: MotorAsSettingsField[] = [
  blowerType,
  shaftOrientation,
  driveType,
  rotationSpeed,
  supportType,
  inputBearing,
  outputBearing,
  bladeCount,
  toothCount
];

export const compressorFields: MotorAsSettingsField[] = [
  compressorType,
  shaftOrientation,
  driveType,
  rotationSpeed,
  supportType,
  inputBearing,
  outputBearing,
  bladeCount,
  toothCount,
  pistonCount
];

enum DirectionCoolingTower {
  Vertical = Direction.Vertical
}
const shaftOrientationCoolingTower: MotorAsSettingsField = {
  label: `${PREFIX}.shaft.orientation`,
  name: 'shaft_orientation',
  description: 'shaft.orientation.desc',
  options: pickOptionsFromNumericEnum(DirectionCoolingTower, `${PREFIX}.shaft.orientation`),
  type: 'enum'
};
enum FanTypeCoolingTower {
  Centrifugal = FanTypeValue.Centrifugal,
  Axial = FanTypeValue.Axial,
  MixedFlow = FanTypeValue.MixedFlow
}
const fanTypeCoolingTower: MotorAsSettingsField = {
  label: `${PREFIX}.fan.type`,
  name: 'fan_type',
  description: 'fan.type.desc',
  options: pickOptionsFromNumericEnum(FanTypeCoolingTower, `${PREFIX}.fan.type`),
  type: 'enum',
  defaultValue: FanTypeCoolingTower.Centrifugal
};
export const coolingTowerFields: MotorAsSettingsField[] = [
  fanTypeCoolingTower,
  shaftOrientationCoolingTower,
  driveType,
  rotationSpeed,
  inputBearing,
  outputBearing,
  bladeCount
];

export const chillerFields: MotorAsSettingsField[] = [
  compressorType,
  shaftOrientation,
  driveType,
  rotationSpeed,
  supportType,
  inputBearing,
  outputBearing,
  bladeCount,
  toothCount,
  pistonCount
];

export const motorSetFields: MotorAsSettingsField[] = [
  setType,
  shaftOrientation,
  driveType,
  rotationSpeed,
  supportType,
  inputBearing,
  outputBearing
];
