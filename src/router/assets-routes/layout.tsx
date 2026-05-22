import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { AssetsProvider } from 'providers/assets';
import { AssetTree } from 'features/asset-tree';
import { Icon } from 'pages/asset/tree-icon';
import { Hooks } from 'domain/asset';
import { PageWithSideBar } from 'features/layout';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { homePathId } = Hooks.useVirturalAsset();
  const { id: pathId = homePathId } = useParams();

  return (
    <AssetsProvider>
      <PageWithSideBar
        content={children ?? <Outlet />}
        sideBar={{
          body: ({ height, close }) => (
            <AssetTree
              icon={(node) => (
                <Icon node={node} height={18} width={18} style={{ position: 'relative', top: 3 }} />
              )}
              height={Math.floor(height)}
              onClick={close}
              selectedKeys={[pathId]}
            />
          )
        }}
      />
    </AssetsProvider>
  );
}
