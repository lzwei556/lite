import React, { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ASSET_PATHNAME } from '../asset-common';
import { isLogin } from '../utils/session';
import { PrimaryLayout } from './layout/primaryLayout';

const AlarmRuleGroups = lazy(() => import('../features/alarm/alarm-group/index'));
const Login = lazy(() => import('./login'));
const Assets = lazy(() => import('../views/home'));
const VirtualAssetDetail = lazy(() => import('../views/home/virtualAssetDetail'));
const Asset = lazy(() => import('../views/home/main'));
const Device = lazy(() => import('../features/device'));
const DeviceVirtual = lazy(() => import('../features/device/virtual'));
const DeviceCreate = lazy(() => import('../features/device/add/create'));
const DeviceDetail = lazy(() => import('../features/device/detail'));
const ImportNetwork = lazy(() => import('../network/import'));
const AlarmRecord = lazy(() => import('../features/alarm/record'));
const Firmware = lazy(() => import('./firmware'));
const User = lazy(() => import('./user'));
const Me = lazy(() => import('./me'));
const Role = lazy(() => import('./system/role'));
const System = lazy(() => import('./system'));
const Project = lazy(() => import('./project'));
const Unauthorized = lazy(() => import('./403'));
const NotFound = lazy(() => import('./404'));
const ServerError = lazy(() => import('./500'));
const Reports = lazy(() => import('./report'));
const ReportList = lazy(() => import('./report/list'));
const Report = lazy(() => import('./report/detail'));

const AppRouter = () => {
  return (
    <HashRouter>
      <Suspense
        fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <Spin />
          </div>
        }
      >
        <Routes>
          <Route path='/' element={<PrimaryLayout />}>
            <Route
              index
              element={
                <Assets>
                  <VirtualAssetDetail />
                </Assets>
              }
            />
            <Route path={ASSET_PATHNAME} element={<Assets />}>
              <Route index element={<VirtualAssetDetail />} />
              <Route path=':id' element={<Asset />} />
              <Route path='0-0' element={<VirtualAssetDetail />} />
            </Route>
            <Route path='devices' element={<Device />}>
              <Route index element={<DeviceVirtual />} />
              <Route path='import' element={<ImportNetwork />} />
              <Route path=':id' element={<DeviceDetail />} />
              <Route path=':id/create' element={<DeviceCreate />} />
              <Route path='0' element={<DeviceVirtual />} />
            </Route>
            <Route path='alarmRules' element={<AlarmRuleGroups />} />
            <Route path='alerts' element={<AlarmRecord />} />
            <Route path='reports' element={<Reports />}>
              <Route index element={<ReportList />} />
              <Route path=':id' element={<Report />} />
            </Route>
            <Route path='projects' element={<Project />} />
            <Route path='users' element={<User />} />
            <Route path='roles' element={<Role />} />
            <Route path='firmwares' element={<Firmware />} />
            <Route path='systeminfo' element={<System />} />
            <Route path='me' element={<Me />} />
          </Route>
          <Route path='/login' element={isLogin() ? <Navigate to='/' /> : <Login />} />
          <Route path='/403' element={<Unauthorized />} />
          <Route path='/500' element={<ServerError />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default AppRouter;
