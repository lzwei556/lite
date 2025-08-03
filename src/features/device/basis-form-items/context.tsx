import React from 'react';
import { GetDefaultDeviceSettingsRequest, GetDeviceSettingRequest } from '../../../apis/device';
import { FormItemsProps, FormCommonProps } from '../settings-common';

type Props = Partial<Pick<FormCommonProps, 'device'>> &
  Pick<FormItemsProps, 'deviceType' | 'settings'> & {
    setDeviceType: React.Dispatch<React.SetStateAction<FormItemsProps['deviceType']>>;
  };

const Context = React.createContext<Props>({
  deviceType: undefined,
  setDeviceType: () => {},
  settings: [],
  device: undefined
});

export const ContextProvier = ({
  children,
  device
}: {
  children: React.ReactNode;
  device?: Props['device'];
}) => {
  return (
    <Context.Provider value={{ ...useDeviceTypeSettings(device), device }}>
      {children}
    </Context.Provider>
  );
};

const useDeviceTypeSettings = (device: Props['device']) => {
  const [deviceType, setDeviceType] = React.useState<Props['deviceType']>(device?.typeId);
  const [settings, setSettings] = React.useState<Props['settings']>([]);
  React.useEffect(() => {
    if (deviceType) {
      if (device?.id) {
        GetDeviceSettingRequest(device.id).then(setSettings);
      } else {
        GetDefaultDeviceSettingsRequest(deviceType).then(setSettings);
      }
    }
    return () => setSettings([]);
  }, [deviceType, device?.id]);
  return { deviceType, setDeviceType, settings };
};

export const useContext = () => React.useContext(Context);
