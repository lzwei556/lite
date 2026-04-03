import { Spin } from 'antd';
import { AppType, AppTypeConfig } from 'domain/app-type';
import React from 'react';
import request from 'utils/request';
import { useAppTypeMappingWithSelectedProject } from './user-profile';
import intl from 'react-intl-universal';

type ContextProps = { type: AppType; analysisEnabled?: boolean };

const Context = React.createContext<ContextProps>({ type: 'windTurbine' });

export function AppProvider({ children }: { children?: JSX.Element }) {
  const [loading, setLoading] = React.useState(true);
  const [config, setConfig] = React.useState<ContextProps>();
  React.useEffect(() => {
    request
      .get<ContextProps>('webConfig')
      .then((res) => {
        if (res.data.code === 200) {
          setConfig(res.data.data);
          // setConfig({type:'vibration'});
        } else {
          throw Error(`API: webConfig occur errors`);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Spin spinning={loading}>
      {config && <Context.Provider value={config}>{children}</Context.Provider>}
    </Spin>
  );
}

export const useAppConfig = () => {
  const { analysisEnabled } = React.useContext(Context);
  const type = useAppType();
  const { name, rootAsset } = AppTypeConfig.get(type);
  const monitoringPointTypeOptions = AppTypeConfig.getMonitoringPointTypeOptions(type).map(
    (opt) => ({ ...opt, label: intl.get(opt.label) })
  );
  const deviceTypes = AppTypeConfig.getDeviceTypes(type);
  return { type, analysisEnabled, name, rootAsset, monitoringPointTypeOptions, deviceTypes };
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
