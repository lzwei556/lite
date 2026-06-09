import React from 'react';
import { useParams } from 'react-router-dom';
import { getMeasurement } from 'monitoring-point';
import { Types, Hooks, Services } from 'domains/asset';
import * as MonitoringPoint from 'domains/monitoring-point';

export type ContextProps = {
  assets: Types.Entity[];
  assetsLoading: boolean;
  loading: boolean;
  refresh: (flag?: boolean) => void;
  selectedNode: Types.Entity | MonitoringPoint.Types.Entity | undefined;
};

const Context = React.createContext<ContextProps>({
  assets: [],
  assetsLoading: false,
  loading: false,
  refresh: () => {},
  selectedNode: undefined
});

export const useAssetsContext = () => React.useContext(Context);

export function AssetsProvider({ children }: { children?: JSX.Element }) {
  const { homePathId } = Hooks.useVirturalAsset();
  const { id: pathId = homePathId } = useParams();
  const [idStr, typeStr] = pathId.split('-');
  const id = Number(idStr);
  const type = Number(typeStr);
  const { loading, runAsync: fetchAsset } = Services.useOne();
  const [selectedNode, setSelectedNode] = React.useState<ContextProps['selectedNode']>();

  const { loading: assetsLoading, data: assets = [], runAsync: fetchAssets } = Services.useList();

  const fetchPoint = (id: number) => {
    getMeasurement(id).then((point) => setSelectedNode(MonitoringPoint.Types.transform(point)));
  };

  const fetchNode = React.useCallback((id: number, type: number) => {
    if (id > 0 && !Number.isNaN(id)) {
      if (type < 10000) {
        fetchAsset(id);
      } else {
        fetchPoint(id);
      }
    }
  }, []);

  const refresh = React.useCallback(
    (flag?: boolean) => {
      if (flag) {
        fetchAssets();
      } else {
        fetchAssets();
        fetchNode(id, type);
      }
    },
    [id, type, fetchAssets, fetchNode]
  );

  React.useEffect(() => {
    fetchNode(id, type);
  }, [id, type, fetchNode]);

  return (
    <Context.Provider value={{ assets, assetsLoading, loading, refresh, selectedNode }}>
      {children}
    </Context.Provider>
  );
}
