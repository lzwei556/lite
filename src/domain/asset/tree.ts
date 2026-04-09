import { AssetRow } from 'asset-common/types';
import { MonitoringPointRow } from 'monitoring-point/types';
import { Points } from 'monitoring-point/util';

export type Node = (Omit<AssetRow, 'children'> | MonitoringPointRow) & {
  children: (AssetRow | (Omit<MonitoringPointRow, 'id'> & { id: string | number }))[];
};

const sort = (assets: AssetRow[]) => {
  return [...assets].sort(
    (prev, crt) =>
      (prev.attributes?.index ?? Number.MAX_VALUE) - (crt.attributes?.index ?? Number.MAX_VALUE)
  );
};

export const combine = (asset: AssetRow): Node => {
  const points = Points.filter(asset.monitoringPoints);
  const children = [
    ...sort(asset.children ?? []),
    ...points
      .map((p) => ({
        ...p,
        parentId: p.assetId,
        id: `${p.id}-${p.type}`
      }))
      .sort((prev, next) => {
        const { index: prevIndex } = prev.attributes || { index: 88 };
        const { index: nextIndex } = next.attributes || { index: 88 };
        return prevIndex - nextIndex;
      })
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
