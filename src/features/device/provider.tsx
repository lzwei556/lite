
import { Device } from "types/device";
import { Network } from "types/network";
import { SelectedDeviceRangeProps, useSelectedDeviceRange } from "./use-selected-device";
import React from "react";
import { Dayjs } from "utils";
import { useVirtualRootDevice } from "./virtual";
import { useParams } from "react-router-dom";
import { GetDeviceRequest, GetDevicesRequest } from "apis/device";
import { DeviceType } from "types/device_type";
import { GetNetworkRequest } from "apis/network";

type ContextProps = {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  devicesLoading: boolean;
  loading: boolean;
  refresh: (id?: number) => void;
  device: Device | undefined;
  setDevice: React.Dispatch<React.SetStateAction<Device | undefined>>;
  network: Network | undefined;
} & SelectedDeviceRangeProps;

const Context = React.createContext<ContextProps>({
  devices: [],
  setDevices: () => {},
  devicesLoading: false,
  loading: false,
  refresh: () => {},
  device: undefined,
  setDevice: () => {},
  network: undefined,
  range: Dayjs.CommonRange.PastWeek,
  numberedRange: Dayjs.toRange(Dayjs.CommonRange.PastWeek),
  onChange: () => {}
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const rootDevice = useVirtualRootDevice();
  const { id: pathId = `${rootDevice.id}` } = useParams();
  const id = Number(pathId);
  const [devicesLoading, setDeviceLoading] = React.useState(false);
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [device, setDevice] = React.useState<Device | undefined>();
  const [network, setNetwork] = React.useState<Network | undefined>();
  const { store, setStore, selectedDeviceRange } = useSelectedDeviceRange(device);

  const fetchDevices = () => {
    setDeviceLoading(true);
    GetDevicesRequest({})
      .then(setDevices)
      .finally(() => setDeviceLoading(false));
  };

  React.useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevice = React.useCallback(
    (id: number) => {
      setLoading(true);
      GetDeviceRequest(Number(id))
        .then((device) => {
          setDevice(device);
          if (device.macAddress !== store.mac) {
            setStore((prev) => ({
              ...prev,
              mac: device.macAddress,
              range: Dayjs.toRange(Dayjs.CommonRange.PastWeek)
            }));
          }
        })
        .finally(() => setLoading(false));
    },
    [store, setStore]
  );

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
      value={{
        devices,
        setDevices,
        devicesLoading,
        device,
        setDevice,
        loading,
        refresh,
        network,
        ...selectedDeviceRange
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useContext = () => {
  return React.useContext(Context);
};
