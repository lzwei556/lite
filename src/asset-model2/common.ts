import { MonitoringPointType } from 'common';

export type PrimaryAssetModel<P extends object, M extends object> = {
  name: string;
  type: string;
  property: { [Key in keyof P]: PrimaryAssetModelPropertyValue };
  measure: { [Key in keyof M]: PrimaryAssetModelMeasureItem };
};

export type PrimaryAssetModelPropertyValue = {
  desc: string;
  type: 'string' | 'float' | 'int';
  unit?: string;
  value: number | number[] | string[];
  group?: string;
};

export type PrimaryAssetModelMeasureItem = {
  type: number;
};

type SingleStageCentrifugalPump = {
  bladeNum: number;
  electricSupplyFreq: number;
  motorPolesNum: number;
  motorNonDriveSideBearing: number;
  motorDriveSideBearing: number;
  pumpDriveSideBearing: number;
  pumpNonDriveSideBearing: number;
  rotSpe: number;
};

type SingleStageCentrifugalPumpMeasure = {
  motorNonDriveEnd: string;
  motorDriveEnd: string;
  pumpDriveEnd: string;
  pumpNonDriveEnd: string;
};

export const SingleStageCentrifugalPumpObj: PrimaryAssetModel<
  SingleStageCentrifugalPump,
  SingleStageCentrifugalPumpMeasure
> = {
  type: '',
  name: '',
  property: {
    motorPolesNum: { desc: 'motor.poles.num', type: 'float', value: 4 },
    electricSupplyFreq: {
      desc: 'electric.supply.freq',
      type: 'float',
      unit: 'Hz',
      value: 50,
      group: ''
    },
    rotSpe: { desc: 'rot.spe', type: 'int', unit: 'RPM', value: 1200, group: '' },
    motorNonDriveSideBearing: { desc: 'motor.non.drive.side.bearing', type: 'float', value: 4 },
    motorDriveSideBearing: { desc: 'motor.drive.side.bearing', type: 'float', value: 4 },
    pumpDriveSideBearing: { desc: 'pump.drive.side.bearing', type: 'float', value: 4 },
    pumpNonDriveSideBearing: { desc: 'pump.non.drive.side.bearing', type: 'float', value: 4 },
    bladeNum: {
      desc: 'pump.blade.num',
      type: 'int',
      value: 5,
      group: ''
    }
  },
  measure: {
    motorNonDriveEnd: {
      type: MonitoringPointType.Value.Vibration
    },
    motorDriveEnd: {
      type: MonitoringPointType.Value.Vibration
    },
    pumpDriveEnd: {
      type: MonitoringPointType.Value.Vibration
    },
    pumpNonDriveEnd: {
      type: MonitoringPointType.Value.Vibration
    }
  }
};
