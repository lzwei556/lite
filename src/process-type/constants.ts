import { DeviceType } from '../types/device_type';
import { ProcessType } from './types';
import * as MonitoringPoint from 'domain/monitoring-point';

export enum ProcessTypeKey {
  AutoFill = 101
}

export const autoFillParameter = {
  targetDeviceId: { name: ['parameters', 'targetDeviceId'], label: 'auto.fill.target.device.id' },
  fillingCapacity: {
    name: ['parameters', 'fillingCapacity'],
    label: 'auto.fill.source.filling.capacity',
    unit: 'ml'
  }
};

export const processTypes: ProcessType[] = [
  {
    key: ProcessTypeKey.AutoFill,
    label: ProcessTypeKey[ProcessTypeKey.AutoFill],
    sourceType: MonitoringPoint.Type.Enum.VibrationAudio,
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
