import { Hooks } from 'domains/asset';
import { TreeNodeDetail } from 'features/asset-tree';
import { lazy } from 'react';
import { useParams } from 'react-router-dom';

const AssetRoot = lazy(() => import('./root'));
const AssetFolder = lazy(() => import('./folder'));
const AssetPrimary = lazy(() => import('./primary'));
const MonitoringPoint = lazy(() => import('monitoring-point/index2')); // TO-DO :移进来

export default function AssetDetail() {
  const { homePathId } = Hooks.useVirturalAsset();
  const { id } = useParams();
  if (id === homePathId) {
    return <AssetRoot />;
  }
  return (
    <TreeNodeDetail
      AssetFolder={AssetFolder}
      AssetPrimary={AssetPrimary}
      MonitoringPoint={MonitoringPoint}
    />
  );
}
