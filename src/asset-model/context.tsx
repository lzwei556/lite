import React from 'react';
import intl from 'react-intl-universal';
import {
  AXIS_ALIAS,
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow,
  Point
} from '../monitoring-point';
import { AssetRow } from '../asset-common';
import { Dayjs, getValue } from '../utils';
import { CharacteristicData, MonitoringPointType } from 'common';

export type PropertyItem = {
  selected: boolean;
  title: string;
  children: string;
  self: MonitoringPointRow;
  property?: CharacteristicData.DisplayProperty;
  visibleKeys: string[];
  axisKey?: string;
  fieldKey?: string;
};

type SelectedMonitoringPoint = Omit<PropertyItem, 'title' | 'children'>;

const AssetModelContext = React.createContext<{
  monitoringPoints: SelectedMonitoringPoint[];
  setMonitoringPoints: React.Dispatch<React.SetStateAction<SelectedMonitoringPoint[]>>;
  selectedMonitoringPoint?: SelectedMonitoringPoint;
  loading: boolean;
  historyData?: HistoryData;
}>({
  monitoringPoints: [],
  setMonitoringPoints: () => {},
  selectedMonitoringPoint: undefined,
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
  const [monitoringPoints, setMonitoringPoints] = React.useState<SelectedMonitoringPoint[]>(
    getInitial(asset)
  );
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
    if (monitoringPoints.length > 0) {
      const isSelectedPointValid = monitoringPoints.every((m) => m.self.assetId === asset.id);
      const selectedMonitoringPoint = monitoringPoints.find((m) => !!m.selected);
      if (selectedMonitoringPoint?.self.id && isSelectedPointValid) {
        fetchData(selectedMonitoringPoint.self.id, Dayjs.toRange(Dayjs.CommonRange.PastWeek));
      } else {
        setMonitoringPoints(getInitial(asset));
      }
    }
  }, [monitoringPoints, asset]);

  return (
    <AssetModelContext.Provider
      value={{
        monitoringPoints,
        setMonitoringPoints,
        selectedMonitoringPoint: monitoringPoints.find((m) => !!m.selected),
        loading,
        historyData
      }}
    >
      {children}
    </AssetModelContext.Provider>
  );
};

export const useAssetModelContext = () => React.useContext(AssetModelContext);

const getInitial = (asset: AssetRow): SelectedMonitoringPoint[] => {
  return (asset.monitoringPoints ?? [])
    .sort((prev, crt) => {
      const { index: prevIndex } = prev.attributes || { index: 88 };
      const { index: nextIndex } = crt.attributes || { index: 88 };
      return prevIndex - nextIndex;
    })
    .map((m, i) => {
      const properties = MonitoringPointType.Key.getProperties(m.type, m.properties);
      const property = properties?.[0];
      const items = getPropertyItem(m, property);
      return {
        selected: i === 0,
        self: m,
        property,
        visibleKeys: properties.filter((p) => !!p.first).map((p) => p.key),
        axisKey: items?.[0]?.axisKey,
        fieldKey: items?.[0]?.fieldKey
      };
    });
};

export function getPropertyItems(
  m: MonitoringPointRow,
  properties: CharacteristicData.DisplayProperty[]
) {
  const items: PropertyItem[] = [];
  properties.forEach((p) => items.push(...getPropertyItem(m, p)));
  return items;
}

const getPropertyItem = (
  m: MonitoringPointRow,
  property: CharacteristicData.DisplayProperty
): PropertyItem[] => {
  const { fields = [], key, name, precision, unit } = property;
  const self = m;
  const selected = false;
  const visibleKeys = MonitoringPointType.Key.getProperties(m.type, m.properties)
    .filter((p) => !!p.first)
    .map((p) => p.key);
  if (fields.length > 1) {
    if (Point.Assert.isVibrationRelated(m.type)) {
      return Object.values(AXIS_ALIAS).map(({ key: aliasKey, abbr }) => {
        const attrs = m.attributes;
        const axisKey = attrs?.[aliasKey];
        const title = `${intl.get(name)} ${intl.get(abbr)}`;
        return {
          selected,
          self,
          visibleKeys,
          title,
          children: getValue({
            value: m?.data?.values[`${key}_${axisKey}`] as number,
            unit,
            precision
          }),
          axisKey,
          fieldKey: undefined,
          property
        };
      });
    } else {
      return fields.map(({ key, name }) => {
        const title = `${intl.get(name)}`;
        return {
          selected,
          self,
          visibleKeys,
          title,
          children: getValue({
            value: m?.data?.values[`${key}`] as number,
            unit,
            precision
          }),
          axisKey: undefined,
          fieldKey: key,
          property
        };
      });
    }
  } else {
    return [
      {
        selected,
        self,
        visibleKeys,
        title: intl.get(name),
        children: getValue({
          value: m?.data?.values[key] as number,
          unit,
          precision
        }),
        property,
        axisKey: undefined,
        fieldKey: undefined
      }
    ];
  }
};
