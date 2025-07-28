import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { PageWithSideBar } from '../../components/pageWithSideBar';
import { AssetTree, ContextProvider, getVirturalAsset } from '../asset-common';

export default function Index({ children }: { children?: React.ReactNode }) {
  const { homePathId } = getVirturalAsset();
  const { id: pathId = homePathId } = useParams();

  return (
    <ContextProvider>
      <PageWithSideBar
        content={children ?? <Outlet />}
        sideBar={{
          body: (height, onClick) => (
            <AssetTree height={height} onClick={onClick} selectedKeys={[pathId]} />
          )
        }}
      />
    </ContextProvider>
  );
}
