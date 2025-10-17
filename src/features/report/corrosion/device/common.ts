import { ColorHealth, ColorOffline } from '../../../../constants/color';
import { getKeyByValue } from '../../../../utils';
import { Report } from '../../types';

export enum DeviceEvalLevel {
  Normal = 0x00,
  Error = 0x01
}

export enum DeviceEvalReason {
  Offline = 0x01,
  LowBattery = 0x02,
  LowSignalStrength = 0x11,
  LowSignalQuality = 0x12
}

export const getDeviceStatus = (report: Report) => {
  const { devices } = report;
  const devicesList = devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error);
  const devicesStatistics = [
    {
      title: '正常',
      value: devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Normal).length,
      color: ColorHealth
    },
    {
      title: '异常',
      value: devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error).length,
      color: ColorOffline
    }
  ];
  return { devicesList, devicesStatistics };
};

export const getDeviceEvalReason = (level: number, reasons: number[]): string => {
  if (reasons.length > 0 && level === DeviceEvalLevel.Error) {
    return getKeyByValue(DeviceEvalReason, reasons[0], 'device.eval.reason');
  } else {
    return 'device.eval.reason.normal';
  }
};
