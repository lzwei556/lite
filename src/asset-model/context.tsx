import React from 'react';
import intl from 'react-intl-universal';
import {
  AXIS_ALIAS,
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow,
  Point
} from '../monitoring-point';
import { DisplayProperty } from '../constants/properties';
import { AssetRow } from '../asset-common';
import { Dayjs, getValue } from '../utils';

export type PropertyItem = {
  title: string;
  children: string;
  propertyKey: string;
  axisKey?: string;
};

type SelectedMonitoringPoint = Pick<PropertyItem, 'propertyKey' | 'axisKey'> & {
  id: number;
  visibleKeys: string[];
};

type SelectedMonitoringPointExtend = {
  point: MonitoringPointRow;
  properties: DisplayProperty[];
  property: DisplayProperty;
  axisKey?: string;
  title?: string;
};

const AssetModelContext = React.createContext<{
  selectedMonitoringPoint?: SelectedMonitoringPoint;
  setSelectedMonitoringPoint: React.Dispatch<
    React.SetStateAction<SelectedMonitoringPoint | undefined>
  >;
  selectedMonitoringPointExtend?: SelectedMonitoringPointExtend;
  loading: boolean;
  historyData?: HistoryData;
}>({
  selectedMonitoringPoint: undefined,
  setSelectedMonitoringPoint: () => {},
  selectedMonitoringPointExtend: undefined,
  loading: false,
  historyData: undefined
});

export const AssetModelProvider = ({
  asset,
  children
}: {
  asset: AssetRow;
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const [selectedMonitoringPoint, setSelectedMonitoringPoint] = React.useState<
    SelectedMonitoringPoint | undefined
  >(transform2Selected(getSelected(asset.monitoringPoints?.[0])));

  const fetchData = (id: number, range: [number, number]) => {
    if (range) {
      const [from, to] = range;
      setLoading(true);
      getDataOfMonitoringPoint(id, from, to).then((data) => {
        setLoading(false);
        if (data.length > 0) {
          setHistoryData(data);
        } else {
          setHistoryData(undefined);
        }
      });
    }
  };

  React.useEffect(() => {
    const isSelectedPointValid = asset.monitoringPoints?.find(
      (m) => m.id === selectedMonitoringPoint?.id
    );
    if (selectedMonitoringPoint?.id && isSelectedPointValid) {
      fetchData(selectedMonitoringPoint.id, Dayjs.toRange(Dayjs.CommonRange.PastWeek));
    } else {
      setSelectedMonitoringPoint(transform2Selected(getSelected(asset.monitoringPoints?.[0])));
    }
  }, [selectedMonitoringPoint?.id, asset]);

  return (
    <AssetModelContext.Provider
      value={{
        selectedMonitoringPoint,
        setSelectedMonitoringPoint,
        selectedMonitoringPointExtend: getSelected(
          asset.monitoringPoints?.find((m) => m.id === selectedMonitoringPoint?.id),
          selectedMonitoringPoint?.propertyKey,
          selectedMonitoringPoint?.axisKey
        ),
        loading,
        historyData
      }}
    >
      {children}
    </AssetModelContext.Provider>
  );
};

export const useAssetModelContext = () => React.useContext(AssetModelContext);

export const getSelected = (
  point?: MonitoringPointRow,
  propertyKey?: string,
  axisKey?: string
): SelectedMonitoringPointExtend | undefined => {
  if (point) {
    const properties = getProperties(point);
    const property = propertyKey ? properties.find((p) => p.key === propertyKey) : properties[0];
    if (property) {
      const items = getPropertyItem(point, property);
      return {
        point,
        properties,
        property,
        axisKey: axisKey ?? items?.[0].axisKey,
        title: items.find((item) => item.propertyKey === propertyKey && item.axisKey === axisKey)
          ?.title
      };
    }
  }
  return undefined;
};

const getProperties = (point?: MonitoringPointRow) => {
  if (point) {
    return Point.getPropertiesByType(point.type, point.properties);
  } else {
    return [];
  }
};

export const transform2Selected = (
  m?: SelectedMonitoringPointExtend
): SelectedMonitoringPoint | undefined => {
  if (m) {
    return {
      id: m.point.id,
      propertyKey: m.property.key,
      axisKey: m.axisKey,
      visibleKeys: m.properties.filter((p) => !!p.first).map((p) => p.key)
    };
  }
  return undefined;
};

export function getPropertyItems(m: MonitoringPointRow, properties: DisplayProperty[]) {
  const items: PropertyItem[] = [];
  properties.forEach((p) => items.push(...getPropertyItem(m, p)));
  return items;
}

const getPropertyItem = (m: MonitoringPointRow, property: DisplayProperty): PropertyItem[] => {
  const { fields = [], key, name, precision, unit } = property;
  if (fields.length > 1) {
    return Object.values(AXIS_ALIAS).map(({ key: aliasKey, abbr }) => {
      const attrs = m.attributes;
      const axisKey = attrs?.[aliasKey];
      const title = `${intl.get(name)} ${intl.get(abbr)}`;
      return {
        title,
        children: getValue({
          value: m?.data?.values[`${key}_${axisKey}`] as number,
          unit,
          precision
        }),
        axisKey,
        propertyKey: key
      };
    });
  } else {
    return [
      {
        title: intl.get(name),
        children: getValue({
          value: m?.data?.values[key] as number,
          unit,
          precision
        }),
        propertyKey: key
      }
    ];
  }
};
