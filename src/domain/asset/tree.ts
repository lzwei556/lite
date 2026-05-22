import { AssetRow } from 'asset-common/types';
import * as MonitoringPoint from 'domain/monitoring-point';
import { Category, sort as flangeMonitoringPointsSort } from './primary';

export type Node = (Omit<AssetRow, 'children'> | MonitoringPoint.Types.Entity) & {
  children: (AssetRow | (Omit<MonitoringPoint.Types.Entity, 'id'> & { id: string | number }))[];
};

const sort = (assets: AssetRow[]) => {
  return [...assets].sort(
    (prev, crt) =>
      (prev.attributes?.index ?? Number.MAX_VALUE) - (crt.attributes?.index ?? Number.MAX_VALUE)
  );
};

export const combine = (asset: AssetRow): Node => {
  const points = Category.Flange.MonitoringPoints.filter(asset.monitoringPoints);
  const children = [
    ...sort(asset.children ?? []),
    ...flangeMonitoringPointsSort(points).map((p) => ({
      ...p,
      parentId: p.assetId,
      id: `${p.id}-${p.type}`
    }))
  ];
  return { ...asset, children };
};

export const pickId = (id: string | number) => {
  if (typeof id === 'number') {
    return id;
  } else if (id.indexOf('-') > -1) {
    return Number(id.substring(0, id.indexOf('-')));
  }
  return 0;
};

export const Path = { Assets: 'assets' };

export const RootNode = { id: 0, type: 0 };
