import { MonitoringPointTypeText, MonitoringPointTypeValue } from '../../../config';
import { DisplayProperty } from '../../../constants/properties';
import { AXIS, AXIS_ALIAS, MONITORING_POINT_DISPLAY_PROPERTIES } from './constants';
import { HistoryData, MonitoringPoint, MonitoringPointRow, Property } from './types';

export const Point = {
  Assert: {
    isTowerRelated: (type: MonitoringPointTypeValue) => {
      return (
        type === MonitoringPointTypeValue.BaseInclination ||
        type === MonitoringPointTypeValue.TopInclination
      );
    },
    isPreload: (type: number) => {
      return (
        type === MonitoringPointTypeValue.BoltPreload ||
        type === MonitoringPointTypeValue.AnchorPreload
      );
    },
    isWindRelated: (type: MonitoringPointTypeValue) => {
      return (
        Point.Assert.isPreload(type) ||
        Point.Assert.isTowerRelated(type) ||
        type === MonitoringPointTypeValue.BoltLoosening
      );
    },
    isVibrationRelated: (type: MonitoringPointTypeValue) => {
      return (
        type === MonitoringPointTypeValue.Vibration ||
        type === MonitoringPointTypeValue.VibrationRotationSingleAxis ||
        type === MonitoringPointTypeValue.VibrationRotation
      );
    },
    isCorrosionRelated: (type: MonitoringPointTypeValue) => {
      return (
        type === MonitoringPointTypeValue.Corrosion ||
        type === MonitoringPointTypeValue.HighTemperatureCorrosion ||
        type === MonitoringPointTypeValue.UltraHighTemperatureCorrosion
      );
    }
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
      name: values.name,
      type: values.type,
      asset_id: values.assetId,
      device_id: firstDevice?.id,
      attributes: !!resolveFn ? resolveFn(values.attributes) : values.attributes,
      channel: firstDevice?.channel === 0 ? 1 : firstDevice?.channel
    };
  },
  getPropertiesByType: (
    monitoringPointType: MonitoringPointTypeValue,
    properties: Property[] = []
  ) => {
    const dispalyPropertiesSettings =
      MONITORING_POINT_DISPLAY_PROPERTIES[
        monitoringPointType as keyof typeof MONITORING_POINT_DISPLAY_PROPERTIES
      ];
    if (!dispalyPropertiesSettings || dispalyPropertiesSettings.length === 0) {
      return properties
        .filter((p) => !!p.isShow)
        .sort((prev, crt) => prev.sort - crt.sort) as DisplayProperty[];
    } else {
      return dispalyPropertiesSettings
        .filter((p) => !p.losingOnMonitoringPoint)
        .map((p) => {
          const remote = properties.find((r) =>
            p.parentKey ? r.key === p.parentKey : r.key === p.key
          );
          return {
            ...p,
            fields:
              p.fields ??
              remote?.fields
                ?.filter((f) => (p.parentKey ? f.key === p.key : true))
                .map((f, i) => ({
                  ...f,
                  first: p.defaultFirstFieldKey
                    ? f.key === p.defaultFirstFieldKey
                    : i === remote?.fields.length - 1
                }))
          };
        })
        .filter((p) => !!p.fields) as DisplayProperty[];
    }
  },
  getTypeLabel: (type: MonitoringPointTypeValue) => {
    for (const key in MonitoringPointTypeValue) {
      if (!Number.isNaN(Number(key)) && type === Number(key)) {
        const _key: keyof typeof MonitoringPointTypeValue = MonitoringPointTypeValue[
          key
        ] as keyof typeof MonitoringPointTypeValue;
        return MonitoringPointTypeText[_key];
      }
    }
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
    return measurements.filter(
      (point) => point.type !== MonitoringPointTypeValue.FlangeBoltPreload
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
