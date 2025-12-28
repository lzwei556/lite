import React from 'react';
import { Spin } from 'antd';
import request from '../utils/request';
import Corrosion from './corrosion';
import CorrosionWirelessHart from './corrosion-wireless-hart';
import Hydro from './hydro';
import Wind from './wind';
import WindPro from './windpro';
import Vibration from './vibration';
import General from './general';
import { ProjectType } from '../project';
import { useSelectedProject } from '../providers/user-profile';

type AppType =
  | 'windTurbine'
  | 'general'
  | 'hydroTurbine'
  | 'corrosion'
  | 'corrosionWirelessHART'
  | 'windTurbinePro'
  | 'vibration'
  | 'towerBolt'
  | 'railBolt'
  | 'bridgeBolt'
  | 'temperature'
  | 'pressure'
  | 'bolt';

type ContextProps = { type: AppType; analysisEnabled?: boolean };

const AppContext = React.createContext<ContextProps>({ type: 'windTurbine' });

const useAppContext = () => React.useContext(AppContext);

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
      {config && <AppContext.Provider value={config}>{children}</AppContext.Provider>}
    </Spin>
  );
}

//util methods

export function useAppConfig() {
  return useAppContext().type;
}

export function useAppType() {
  let appType = useAppContext().type;
  const selectedProject = useSelectedProject();
  const projectType = selectedProject?.type;
  if (appType === 'general') {
    if (projectType === ProjectType.WindPowerBoltMonitoring) {
      appType = 'windTurbinePro';
    } else if (projectType === ProjectType.HydroPowerBoltMonitoring) {
      appType = 'hydroTurbine';
    } else if (projectType === ProjectType.TowerBoltMonitoring) {
      appType = 'towerBolt';
    } else if (projectType === ProjectType.RailBoltMonitoring) {
      appType = 'railBolt';
    } else if (projectType === ProjectType.BridgeBoltMonitoring) {
      appType = 'bridgeBolt';
    } else if (projectType === ProjectType.CorrosionMonitoring) {
      appType = 'corrosion';
    } else if (projectType === ProjectType.VibrationMonitoring) {
      appType = 'vibration';
    } else if (projectType === ProjectType.TemperatureMonitoring) {
      appType = 'temperature';
    } else if (projectType === ProjectType.PressureMonitoring) {
      appType = 'pressure';
    } else if (projectType === ProjectType.BoltMonitoring) {
      appType = 'bolt';
    }
  }
  return appType;
}

export function useAppVibrationEnabled() {
  return !!useAppContext().analysisEnabled;
}

export const App = {
  getSiteName: (type: AppType) => get(type).siteName,
  getMonitoringPointTypes: (type: AppType) => get(type).monitoringPointTypes,
  getDeviceTypes: (type: AppType) => get(type).deviceTypes,
  isWindLike: (type: AppType) =>
    type === 'windTurbine' || type === 'windTurbinePro' || type === 'hydroTurbine'
};

function get(type: AppType) {
  switch (type) {
    case 'corrosion':
      return {
        siteName: Corrosion.SiteName,
        monitoringPointTypes: Corrosion.MonitoringPointTypeOptions,
        deviceTypes: Corrosion.DeviceTypes
      };
    case 'corrosionWirelessHART':
      return {
        siteName: CorrosionWirelessHart.SiteName,
        monitoringPointTypes: CorrosionWirelessHart.MonitoringPointTypeOptions,
        deviceTypes: CorrosionWirelessHart.DeviceTypes
      };
    case 'hydroTurbine':
      return {
        siteName: Hydro.SiteName,
        monitoringPointTypes: Hydro.MonitoringPointTypeOptions,
        deviceTypes: Hydro.DeviceTypes
      };
    case 'windTurbine':
      return {
        siteName: Wind.SiteName,
        monitoringPointTypes: Wind.MonitoringPointTypeOptions,
        deviceTypes: Wind.DeviceTypes
      };
    case 'windTurbinePro':
      return {
        siteName: WindPro.SiteName,
        monitoringPointTypes: WindPro.MonitoringPointTypeOptions,
        deviceTypes: WindPro.DeviceTypes
      };
    case 'vibration':
      return {
        siteName: Vibration.SiteName,
        monitoringPointTypes: Vibration.MonitoringPointTypeOptions,
        deviceTypes: Vibration.DeviceTypes
      };
    default:
      return {
        siteName: General.SiteName,
        monitoringPointTypes: General.MonitoringPointTypeOptions,
        deviceTypes: General.DeviceTypes
      };
  }
}
