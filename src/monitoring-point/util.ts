import { MonitoringPointType } from '../common';
import { AXIS, AXIS_ALIAS } from './constants';
import { HistoryData, MonitoringPoint, MonitoringPointRow } from './types';

export const Point = {
  Assert: {
    isTowerRelated: (type: MonitoringPointType.Value) => {
      return MonitoringPointType.Categories.getKeys(['inclination']).includes(type);
    },
    isPreload: (type: number) => {
      return MonitoringPointType.Categories.getKeys(['preload']).includes(type);
    },
    isWindRelated: (type: MonitoringPointType.Value) => {
      return (
        Point.Assert.isPreload(type) ||
        Point.Assert.isTowerRelated(type) ||
        MonitoringPointType.Categories.getKeys(['loosening']).includes(type)
      );
    },
    isVibrationRelated: (type: MonitoringPointType.Value) => {
      return MonitoringPointType.Categories.getKeys(['vibration']).includes(type);
    },
    isThreeAxisedVibrationRelated: (type: MonitoringPointType.Value) => {
      return (
        Point.Assert.isVibrationRelated(type) &&
        type !== MonitoringPointType.Value.VibrationRotationSingleAxis
      );
    },
    isCorrosionRelated: (type: MonitoringPointType.Value) => {
      return MonitoringPointType.Categories.getKeys(['corrosion']).includes(type);
    },
    isTemperatureRelated: (type: MonitoringPointType.Value) =>
      MonitoringPointType.Categories.getKeys(['temperature']).includes(type),
    isPressureRelated: (type: MonitoringPointType.Value) =>
      MonitoringPointType.Categories.getKeys(['pressure']).includes(type)
  },
  convert: (
    values?: MonitoringPointRow,
    resolveFn?: (attr: MonitoringPointRow['attributes']) => any
  ): MonitoringPoint | null => {
    if (!values) return null;
    const firstDevice =
      values.bindingDevices && values.bindingDevices.length > 0
        ? values.bindingDevices[0]
        : undefined;
    return {
      id: values.id,
      component_id: values.componentId ? values.componentId : undefined,
      name: values.name,
      type: values.type,
      asset_id: values.assetId,
      device_id: firstDevice?.id,
      attributes: !!resolveFn ? resolveFn(values.attributes) : values.attributes,
      channel: firstDevice?.channel === 0 ? 1 : firstDevice?.channel
    };
  },
  getAxis: (key?: string) => {
    if (key === AXIS.X.key) {
      return AXIS.X;
    }
    if (key === AXIS.Y.key) {
      return AXIS.Y;
    }
    if (key === AXIS.Z.key) {
      return AXIS.Z;
    }
  },
  getAxisAlias: (axisKey: string, attrs?: MonitoringPointRow['attributes']) => {
    if (attrs) {
      if (axisKey === attrs.axial) {
        return AXIS_ALIAS.Axial;
      }
      if (axisKey === attrs.vertical) {
        return AXIS_ALIAS.Vertical;
      }
      if (axisKey === attrs.horizontal) {
        return AXIS_ALIAS.Horizontal;
      }
    }
  }
};

export const Points = {
  filter: (measurements?: MonitoringPointRow[]) => {
    if (!measurements) return [];
    return measurements.filter((point) =>
      MonitoringPointType.Key.filterNonVirtualTypes(point.type)
    );
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
