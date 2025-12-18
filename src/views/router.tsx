import React, { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { ASSET_PATHNAME } from '../asset-common';
import { PrimaryLayout } from './layout/primaryLayout';
import { Authenticated } from '../features/auth';
import { ProfileProvider, ProjectVerification } from '../providers/user-profile';
import { ENV } from '../utils';

const AlarmRuleGroups = lazy(() => import('../features/alarm/alarm-group/index'));
const Login = lazy(() => import('./login'));
const Assets = lazy(() => import('../views/home'));
const VirtualAssetDetail = lazy(() =>
  ENV.legacyEnabled === 'true'
    ? import('../views/home/virtualAssetDetail-legacy')
    : import('../views/home/virtualAssetDetail')
);
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
const Reports = lazy(() => import('../features/report'));
const ReportList = lazy(() => import('../features/report/list'));
const Report = lazy(() => import('../features/report/detail'));

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
          <Route
            path='/'
            element={
              <Authenticated>
                <ProfileProvider>
                  <PrimaryLayout />
                </ProfileProvider>
              </Authenticated>
            }
          >
            <Route
              index
              element={
                <ProjectVerification>
                  <Assets>
                    <VirtualAssetDetail />
                  </Assets>
                </ProjectVerification>
              }
            />
            <Route
              path={ASSET_PATHNAME}
              element={
                <ProjectVerification>
                  <Assets />
                </ProjectVerification>
              }
            >
              <Route index element={<VirtualAssetDetail />} />
              <Route path=':id' element={<Asset />} />
              <Route path='0-0' element={<VirtualAssetDetail />} />
            </Route>
            <Route
              path='devices'
              element={
                <ProjectVerification>
                  <Device />
                </ProjectVerification>
              }
            >
              <Route index element={<DeviceVirtual />} />
              <Route path='import' element={<ImportNetwork />} />
              <Route path=':id' element={<DeviceDetail />} />
              <Route path=':id/create' element={<DeviceCreate />} />
              <Route path='0' element={<DeviceVirtual />} />
            </Route>
            <Route
              path='alarmRules'
              element={
                <ProjectVerification>
                  <AlarmRuleGroups />
                </ProjectVerification>
              }
            />
            <Route
              path='alerts'
              element={
                <ProjectVerification>
                  <AlarmRecord />
                </ProjectVerification>
              }
            />
            <Route
              path='reports'
              element={
                <ProjectVerification>
                  <Reports />
                </ProjectVerification>
              }
            >
              <Route index element={<ReportList />} />
              <Route path=':id' element={<Report />} />
            </Route>
            <Route path='projects' element={<Project />} />
            <Route
              path='users'
              element={
                <ProjectVerification>
                  <User />
                </ProjectVerification>
              }
            />
            <Route path='roles' element={<Role />} />
            <Route
              path='firmwares'
              element={
                <ProjectVerification>
                  <Firmware />
                </ProjectVerification>
              }
            />
            <Route path='systeminfo' element={<System />} />
            <Route path='me' element={<Me />} />
          </Route>
          <Route
            element={
              <Authenticated fallback={<Outlet />}>
                <Navigate to='/' />
              </Authenticated>
            }
          >
            <Route path='/login' element={<Login />} />
          </Route>
          <Route path='/403' element={<Unauthorized />} />
          <Route path='/500' element={<ServerError />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default AppRouter;
