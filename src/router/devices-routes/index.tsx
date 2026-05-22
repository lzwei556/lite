import { Route } from 'react-router-dom';
import Layout from './layout';
import { lazy } from 'react';

const DeviceVirtual = lazy(() => import('features/device/virtual'));
const DeviceCreate = lazy(() => import('features/device/add/create'));
const DeviceDetail = lazy(() => import('features/device/detail'));
const ImportNetwork = lazy(() => import('network/import'));

export const devicesRoutes = (
  <Route path='devices' element={<Layout />}>
    <Route index element={<DeviceVirtual />} />
    <Route path='import' element={<ImportNetwork />} />
    <Route path=':id' element={<DeviceDetail />} />
    <Route path=':id/create' element={<DeviceCreate />} />
  </Route>
);
