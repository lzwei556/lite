import { Spin } from 'antd';
import * as App from 'domain/app-type';
import React from 'react';
import request from 'utils/request';
import { useAppTypeMappingWithSelectedProject } from './user-profile';
import intl from 'react-intl-universal';
import { useRequest } from 'ahooks';

type ContextProps = { type: App.Type; analysisEnabled?: boolean };

const Context = React.createContext<ContextProps>({ type: 'windTurbine' });

export function AppProvider({ children }: { children?: JSX.Element }) {
  const { loading, data } = useWebConfig();

  return (
    <Spin spinning={loading}>
      {data && <Context.Provider value={data}>{children}</Context.Provider>}
    </Spin>
  );
}

export const useAppConfig = () => {
  const { analysisEnabled } = React.useContext(Context);
  const type = useAppType();
  const { name, rootAsset, folderAssetTypes } = App.get(type);
  const monitoringPointTypeOptions = App.getMonitoringPointTypeOptions(type).map((opt) => ({
    ...opt,
    label: intl.get(opt.label)
  }));
  const deviceTypes = App.getDeviceTypes(type);
  return {
    type,
    analysisEnabled,
    name,
    rootAsset,
    folderAssetTypes,
    monitoringPointTypeOptions,
    deviceTypes
  };
};

const useAppType = () => {
  let appTypeFromServer = React.useContext(Context).type;
  let appType = appTypeFromServer;
  const mappingAppType = useAppTypeMappingWithSelectedProject();
  if (appType === 'general' && mappingAppType) {
    appType = mappingAppType;
  }
  return appType;
};

const useWebConfig = () => useRequest(getWebConfig);

const getWebConfig = async () => request.get<ContextProps>('webConfig');
