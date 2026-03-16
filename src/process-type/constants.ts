import { MonitoringPointType } from 'common';
import { DeviceType } from '../types/device_type';
import { ProcessType } from './types';

export enum ProcessTypeKey {
  'Auto-Fill' = 101
}

export const autoFillParameter = {
  targetDeviceId: { name: ['parameters', 'targetDeviceId'], label: 'device.type.oil.filler' },
  fillingCapacity: {
    name: ['parameters', 'fillingCapacity'],
    label: 'process.auto-fill.capacity',
    unit: 'ml'
  }
};

export const processTypes: ProcessType[] = [
  {
    key: ProcessTypeKey['Auto-Fill'],
    label: ProcessTypeKey[ProcessTypeKey['Auto-Fill']],
    sourceType: MonitoringPointType.Value.VibrationAudio,
    deviceType: DeviceType.OilFiller,
    parameters: [
      {
        ...autoFillParameter.targetDeviceId,
        type: 'number',
        options: [],
        rules: [{ required: true }]
      },
      {
        ...autoFillParameter.fillingCapacity,
        type: 'number',
        rules: [{ required: true }]
      }
    ]
  }
];
