import { MonitoringPointTypeValue } from '../config';

export type PrimaryAssetModel<P extends object> = {
  name: string;
  type: string;
  property: { [Key in keyof P]: PropertyValue };
  measure: { [key: string]: MeasureItem };
};

type PropertyValue = {
  desc: string;
  type: 'string' | 'float' | 'int';
  unit?: string;
  value: number | number[] | string[];
  group?: string;
};

type MeasureItem = {
  name: string;
  type: number;
};

type SingleStageCentrifugalPump = {
  rotationSpeed: number;
  frequency: number;
  poleNum: number;
  bladeNum: number;
};

export const SingleStageCentrifugalPumpObj: PrimaryAssetModel<SingleStageCentrifugalPump> = {
  type: '',
  name: '单级离心泵',
  property: {
    rotationSpeed: { desc: 'rotation.speed', type: 'int', unit: 'RPM', value: 1200, group: '电机' },
    frequency: { desc: '电机供电频率', type: 'float', unit: 'Hz', value: 50, group: '电机' },
    poleNum: { desc: '电机极数', type: 'float', value: 4 },
    bladeNum: {
      desc: '叶轮叶片数量',
      type: 'int',
      value: 5,
      group: '泵'
    }
  },
  measure: {
    motorDriveEnd: {
      name: '电机驱动端',
      type: MonitoringPointTypeValue.Vibration
    },
    motorNonDriveEnd: {
      name: '电机非驱动端',
      type: MonitoringPointTypeValue.Vibration
    },
    pumpDriveEnd: {
      name: '泵驱动端',
      type: MonitoringPointTypeValue.Vibration
    },
    pumpNonDriveEnd: {
      name: '泵非驱动端',
      type: MonitoringPointTypeValue.Vibration
    }
  }
};
