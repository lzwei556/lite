import { ColorDanger, ColorHealth, ColorInfo, ColorWarn } from '../../../../constants/color';
import { getKeyByValue } from '../../../../utils';
import { Report } from '../../types';

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

export const getMonitoringPointEvalLevelColor = (level: number): string => {
  if (level === MonitoringPointEvalLevel.Minor) {
    return ColorInfo;
  } else if (level === MonitoringPointEvalLevel.Major) {
    return ColorWarn;
  } else if (level === MonitoringPointEvalLevel.Critical) {
    return ColorDanger;
  } else {
    return 'unset';
  }
};

export const getMonitoringPoints = (report: Report) => {
  const { monitoringPoints } = report;
  const monitoringStatusStatistics = [
    {
      title: '正常',
      value: monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Normal)
        .length,
      color: ColorHealth
    },
    {
      title: '低风险',
      value: monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Minor)
        .length,
      color: ColorInfo
    },
    {
      title: '中风险',
      value: monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Major)
        .length,
      color: ColorWarn
    },
    {
      title: '高风险',
      value: monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Critical)
        .length,
      color: ColorDanger
    }
  ];
  return { monitoringPoints, monitoringStatusStatistics };
};
