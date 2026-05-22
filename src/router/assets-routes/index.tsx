import { AssetTree } from 'domain/asset';
import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

const Layout = lazy(() => import('./layout'));
const Detail = lazy(() => import('pages/asset'));

export const assetsRoutes = (
  <Route path={AssetTree.Path.Assets} element={<Layout />}>
    <Route
      index
      element={<Navigate to={`${AssetTree.RootNode.id}-${AssetTree.RootNode.type}`} replace />}
    />
    <Route path=':id' element={<Detail />} />
  </Route>
);
