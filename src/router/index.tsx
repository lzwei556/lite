import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Loading } from './loading';
import Login from 'pages/login';
import { ProjectLayout, ProtectedLayout } from './guards';
import { assetsRoutes } from './assets-routes';
import { devicesRoutes } from './devices-routes';
import { reportsRoutes } from './routes/reports';
import { NotFound } from 'pages/not-found';
import { AssetTree } from 'domain/asset';

const AlarmRuleGroups = lazy(() => import('features/alarm/alarm-group/index'));
const AlarmRecord = lazy(() => import('features/alarm/record'));
const Firmwares = lazy(() => import('pages/firmwares'));
const Users = lazy(() => import('pages/users'));
const Me = lazy(() => import('pages/me'));
const Roles = lazy(() => import('pages/roles'));
const ServerStatus = lazy(() => import('pages/server-status'));
const Projects = lazy(() => import('pages/projects'));

export const AppRouter = () => {
  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route element={<ProjectLayout />}>
              <Route index element={<Navigate to={AssetTree.Path.Assets} replace />} />
              {assetsRoutes}
              {devicesRoutes}
              <Route path='alarmRules' element={<AlarmRuleGroups />} />
              <Route path='alerts' element={<AlarmRecord />} />
              {reportsRoutes}
              <Route path='users' element={<Users />} />
              <Route path='firmwares' element={<Firmwares />} />
            </Route>
            <Route path='projects' element={<Projects />} />
            <Route path='roles' element={<Roles />} />
            <Route path='systeminfo' element={<ServerStatus />} />
            <Route path='me' element={<Me />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};
