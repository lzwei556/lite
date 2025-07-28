import React, { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import {
  Assets,
  VirtualAssetDetail,
  Asset,
  Device,
  DeviceDetail,
  Firmware,
  Login,
  Me,
  NotFound,
  Project,
  Role,
  ServerError,
  System,
  Unauthorized,
  User,
  ImportNetwork,
  AlarmRecord,
  DeviceVirtual
} from '../views';
import { PrimaryLayout } from '../views/layout/primaryLayout';
import { ConfigProvider, Spin } from 'antd';
import { useLocaleContext } from '../localeProvider';
import intl from 'react-intl-universal';
import en_US from '../locales/en-US.json';
import zh_CN from '../locales/zh-CN.json';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import { Dayjs } from '../utils';
import 'dayjs/locale/zh-cn';
import { App, useAppType } from '../config';
import { ASSET_PATHNAME } from '../views/asset-common';
import { isLogin } from '../utils/session';

const AlarmRuleGroups = lazy(() => import('../views/alarm/alarm-group/index'));

const AppRouter = () => {
  const config = useAppType();
  const [renderingKey, setRenderingKey] = React.useState(0);
  const { language } = useLocaleContext();

  React.useEffect(() => {
    intl.init({
      locales: {
        'en-US': en_US,
        'zh-CN': zh_CN
      },
      currentLocale: language
    });
    setRenderingKey((prev) => prev + 1);
    if (language === 'zh-CN') {
      Dayjs.dayjs.locale('zh-cn');
    } else {
      Dayjs.dayjs.locale('en');
    }
  }, [language]);

  React.useEffect(() => {
    if (renderingKey) {
      document.title = intl.get(App.getSiteName(config));
    }
  }, [language, renderingKey, config]);

  return (
    renderingKey && (
      <ConfigProvider
        locale={language === 'zh-CN' ? zhCN : enUS}
        theme={{ components: { Menu: { itemHoverColor: '#1677ff' }, Tree: { indentSize: 8 } } }}
      >
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
                  <Route path='0' element={<DeviceVirtual />} />
                </Route>
                <Route path='alarmRules' element={<AlarmRuleGroups />} />
                <Route path='alerts' element={<AlarmRecord />} />
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
      </ConfigProvider>
    )
  );
};

export default AppRouter;
