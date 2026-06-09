import * as MonitoringPoint from 'domains/monitoring-point';
import { HistoryData } from './types';

export const Point = {
  Assert: {
    isVibrationRelated: (type: MonitoringPoint.Type.Enum) => {
      return MonitoringPoint.Type.Category.getTypes(['vibration']).includes(type);
    }
  }
};

export function isMonitoringPoint(type: number) {
  return type > 10000;
}

export const hasData = (
  data:
    | HistoryData
    | {
        name: string;
        data: HistoryData;
      }[]
    | undefined
) => {
  if (data === null || data === undefined) {
    return false;
  } else if (Array.isArray(data) && data.length > 0) {
    const item = data[0];
    if (item.hasOwnProperty('data')) {
      return (
        data as {
          name: string;
          data: HistoryData;
        }[]
      ).some(({ data }) => data.length > 0);
    }
    return true;
  }
  return false;
};
