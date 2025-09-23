import { getKeyByValue } from '../../utils';

export const A4_SIZE = { width: 210, height: 297, unit: 'mm', padding: 20 };
export const A4_HEIGHT = 1122.519;
const PREFACE_PLATFORM = '博感云平台';
const COMPANY = '嘉兴博感科技有限公司';
export const ALARM_LEVELS = ['正常', '普通', '重要', '紧急'];
export const PREFACES = [
  `本评估报告由${PREFACE_PLATFORM}自动生成，版权归${COMPANY}所有；`,
  `委托方负有对监测报告保密的义务，未经受托方书面许可不得将本报告提供给第三方、印刷成其它宣传材料或发布于网络等公共信息平台；`,
  `本报告为${PREFACE_PLATFORM}对机组的分析和诊断、维护建议，仅供参考，具体维护维修措施还需要委托方自行决定；`,
  `本报告不作为任何理赔，诉讼等证明材料；`
];
export const PAGE_GAP = 15;

export enum ReportType {
  Weekly = 1,
  Monthly
}

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

export const getDeviceEvalReason = (level: number, reasons: number[]): string => {
  if (reasons.length > 0 && level === DeviceEvalLevel.Error) {
    return getKeyByValue(DeviceEvalReason, reasons[0], 'device.eval.reason');
  } else {
    return 'device.eval.reason.normal';
  }
};

export enum MonitoringPointEvalLevel {
  Normal = 0x00,
  Minor = 0x01,
  Major = 0x02,
  Critical = 0x03
}

export enum MonitoringPointEvalReason {
  HasAlarms = 0x01,
  HighCorrosionRate = 0x11,
  HighCorrosionLoss = 0x12,
  LowResidualLife = 0x13
}

export const getMonitoringPointEvalLevel = (level: number): string => {
  if (level === MonitoringPointEvalLevel.Normal) {
    return 'monitoring.point.eval.level.normal';
  } else {
    return getKeyByValue(MonitoringPointEvalLevel, level, 'monitoring.point.eval.level');
  }
};
