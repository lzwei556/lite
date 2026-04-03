import { AssetRow } from 'asset-common/types';
import { MonitoringPointRow } from 'monitoring-point/types';
import { Points } from 'monitoring-point/util';
import { useSelectedProject } from 'providers/user-profile';

export type AssetTreeNode = (Omit<AssetRow, 'children'> | MonitoringPointRow) & {
  children: (AssetRow | (Omit<MonitoringPointRow, 'id'> & { id: string | number }))[];
};

export const useVirturalAsset = () => {
  const selectedProject = useSelectedProject();
  const root = {
    id: 0,
    type: 0,
    name: selectedProject?.name
  };
  const homePathId = `${root.id}-${root.type}`;
  return { root, homePathId };
};

const sort = (assets: AssetRow[]) => {
  return [...assets].sort(
    (prev, crt) =>
      (prev.attributes?.index ?? Number.MAX_VALUE) - (crt.attributes?.index ?? Number.MAX_VALUE)
  );
};

export const AssetTree = {
  combine: (asset: AssetRow): AssetTreeNode => {
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
  },
  pickId: (id: string | number) => {
    if (typeof id === 'number') {
      return id;
    } else if (id.indexOf('-') > -1) {
      return Number(id.substring(0, id.indexOf('-')));
    }
    return 0;
  },
  useVirturalAsset: () => {
    const selectedProject = useSelectedProject();
    const root = {
      id: 0,
      type: 0,
      name: selectedProject?.name
    };
    const homePathId = `${root.id}-${root.type}`;
    return { root, homePathId };
  },
  Path: { Assets: 'assets' }
};
