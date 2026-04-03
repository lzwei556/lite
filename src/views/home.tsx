import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { PageWithSideBar } from 'components';
import { AssetsProvider } from 'providers/assets';
import { AssetTree } from 'features/asset-tree';
import { Icon } from 'asset-tree/icon';
import { AssetTree as AssetTreeConfig } from 'domain/asset';

export default function Index({ children }: { children?: React.ReactNode }) {
  const { homePathId } = AssetTreeConfig.useVirturalAsset();
  const { id: pathId = homePathId } = useParams();

  return (
    <AssetsProvider>
      <PageWithSideBar
        content={children ?? <Outlet />}
        sideBar={{
          body: (height, onClick) => (
            <AssetTree
              icon={(node) => (
                <Icon node={node} height={18} width={18} style={{ position: 'relative', top: 3 }} />
              )}
              height={height}
              onClick={onClick}
              selectedKeys={[pathId]}
            />
          )
        }}
      />
    </AssetsProvider>
  );
}
