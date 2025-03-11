import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import './deviceList.css';
import { Device } from '../../types/device';
import { GetNetworkRequest } from '../../apis/network';
import { PageWithSideBar } from '../../components/pageWithSideBar';
import { DeviceTree } from './deviceTree';
import { getProject } from '../../utils/session';
import { GetDeviceRequest, GetDevicesRequest } from '../../apis/device';
import { DeviceType } from '../../types/device_type';
import { Network } from '../../types/network';
import { Virtual } from './virtual';

export const VIRTUAL_ROOT_DEVICE = {
  macAddress: '000000000000',
  id: 0,
  name: getProject().name
};

const virtualPathId = `${VIRTUAL_ROOT_DEVICE.id}`;

const DevicePage = () => {
  const { pathname } = useLocation();
  const isRouteImport = pathname === '/devices/import';
  const { id: pathId = virtualPathId } = useParams();

  return (
    <ContextProvider>
      <PageWithSideBar
        content={pathId === virtualPathId && !isRouteImport ? <Virtual /> : <Outlet key={pathId} />}
        sideBar={{
          body: (height, onClick) => (
            <DeviceTree height={height} onClick={onClick} selectedKeys={[pathId]} />
          )
        }}
      />
    </ContextProvider>
  );
};

export default DevicePage;

type ContextProps = {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  devicesLoading: boolean;
  loading: boolean;
  refresh: (id?: number) => void;
  device: Device | undefined;
  setDevice: React.Dispatch<React.SetStateAction<Device | undefined>>;
  network: Network | undefined;
};

const Context = React.createContext<ContextProps>({
  devices: [],
  setDevices: () => {},
  devicesLoading: false,
  loading: false,
  refresh: () => {},
  device: undefined,
  setDevice: () => {},
  network: undefined
});

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { id: pathId = virtualPathId } = useParams();
  const id = Number(pathId);
  const [devicesLoading, setDeviceLoading] = React.useState(false);
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [device, setDevice] = React.useState<Device | undefined>();
  const [network, setNetwork] = React.useState<Network | undefined>();

  const fetchDevices = () => {
    setDeviceLoading(true);
    GetDevicesRequest({})
      .then(setDevices)
      .finally(() => setDeviceLoading(false));
  };

  React.useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevice = React.useCallback((id: number) => {
    setLoading(true);
    GetDeviceRequest(Number(id))
      .then(setDevice)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (device) {
      const { network, typeId } = device;
      if (network?.id && DeviceType.isGateway(typeId)) {
        GetNetworkRequest(network.id).then((data) => {
          setNetwork(data);
        });
      }
    }
  }, [device]);

  React.useEffect(() => {
    if (!Number.isNaN(id) && id > 0) {
      fetchDevice(id);
    }
  }, [id, fetchDevice]);

  const refresh = React.useCallback(
    (id?: number) => {
      if (id) {
        fetchDevice(id);
        fetchDevices();
      } else {
        fetchDevices();
      }
    },
    [fetchDevice]
  );

  return (
    <Context.Provider
      value={{ devices, setDevices, devicesLoading, device, setDevice, loading, refresh, network }}
    >
      {children}
    </Context.Provider>
  );
};

export const useContext = () => {
  return React.useContext(Context);
};
