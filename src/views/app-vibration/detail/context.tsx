import React from 'react';
import intl from 'react-intl-universal';
import { DisplayProperty } from '../../../constants/properties';
import { getValue, roundValue, truncate } from '../../../utils/format';
import { AssetRow, AXIS_ALIAS, MonitoringPointRow, Point } from '../../asset-common';

type PropertyItem = {
  label: React.ReactNode;
  title?: string;
  children: string;
  key: string;
  axisKey?: string;
};

export type MonitoringPointPropertyItem = MonitoringPointRow &
  PropertyItem & { property: DisplayProperty };

const AssetContext = React.createContext<{
  selectedPoint: MonitoringPointPropertyItem | undefined;
  setSelectedPoint: React.Dispatch<React.SetStateAction<MonitoringPointPropertyItem | undefined>>;
  firstPoint: MonitoringPointRow | undefined;
  properties: DisplayProperty[];
}>({ selectedPoint: undefined, setSelectedPoint: () => {}, firstPoint: undefined, properties: [] });

export const AssetProvider = ({
  asset,
  children
}: {
  asset: AssetRow;
  children: React.ReactNode;
}) => {
  const firstPoint = asset.monitoringPoints?.[0];
  const properties = getProperties(asset);
  const [selectedPoint, setSelectedPoint] = React.useState<MonitoringPointPropertyItem | undefined>(
    getDefaultSelectedPoint(asset)
  );
  return (
    <AssetContext.Provider value={{ selectedPoint, setSelectedPoint, firstPoint, properties }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetContext = () => React.useContext(AssetContext);

const getProperties = (asset: AssetRow) => {
  let properties: DisplayProperty[] = [];
  if (asset.monitoringPoints && asset.monitoringPoints.length > 0) {
    const first = asset.monitoringPoints[0];
    properties = Point.getPropertiesByType(first.properties, first.type);
  }
  return properties;
};

export const getDefaultSelectedPoint = (asset: AssetRow) => {
  const properties = getProperties(asset);
  const firstPoint = asset.monitoringPoints?.[0];
  if (firstPoint && properties.length > 0) {
    return {
      ...firstPoint,
      ...getPropertyValues(firstPoint, properties)[0],
      property: properties[0]
    };
  }
  return undefined;
};

export function getPropertyValues(m: MonitoringPointRow, properties: DisplayProperty[]) {
  const items: PropertyItem[] = [];
  properties.forEach(({ fields = [], key, name, precision, unit }) => {
    if (fields.length > 1) {
      items.push(
        ...Object.values(AXIS_ALIAS).map(({ key: aliasKey, label }) => {
          const attrs = m.attributes;
          const axisKey = attrs?.[aliasKey];
          const title = `${intl.get(name)} ${intl.get(label)}`;
          return {
            label: truncate(title, 24),
            title,
            children: `${getValue(
              roundValue(m?.data?.values[`${key}_${axisKey}`] as number, precision),
              unit
            )}`,
            axisKey,
            key
          };
        })
      );
    } else {
      items.push({
        label: truncate(intl.get(name), 24),
        title: intl.get(name),
        children: `${getValue(roundValue(m?.data?.values[key] as number, precision))}${unit}`,
        axisKey: undefined,
        key
      });
    }
  });
  return items;
}
