import { MonitoringPointType, OMonitoringPoint } from 'domain/monitoring-point';
import { HistoryData, MonitoringPointRow } from './types';

export const Point = {
  Assert: {
    isVibrationRelated: (type: MonitoringPointType) => {
      return OMonitoringPoint.Type.Category.getTypes(['vibration']).includes(type);
    }
  }
};

export const Points = {
  filter: (measurements?: MonitoringPointRow[]) => {
    if (!measurements) return [];
    return measurements.filter((point) => !OMonitoringPoint.Type.isVirtual(point.type));
  },
  sort: (measurements: MonitoringPointRow[]) => {
    return measurements.sort((prev, next) => {
      const { index: prevIndex } = prev.attributes || { index: 88 };
      const { index: nextIndex } = next.attributes || { index: 88 };
      return prevIndex - nextIndex;
    });
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
