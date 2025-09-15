import React from 'react';
import { GetDeviceSettingRequest } from '../../../apis/device';
import { FormItemsProps, FormCommonProps } from '../settings-common';

type Props = Partial<Pick<FormCommonProps, 'device'>> &
  Pick<FormItemsProps, 'deviceType' | 'settings'> & {
    setDeviceType: React.Dispatch<React.SetStateAction<FormItemsProps['deviceType']>>;
    setSettings: React.Dispatch<React.SetStateAction<FormItemsProps['settings']>>;
  };

const Context = React.createContext<Props>({
  deviceType: undefined,
  setDeviceType: () => {},
  settings: [],
  setSettings: () => {},
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
    if (device?.id) {
      GetDeviceSettingRequest(device.id).then(setSettings);
    }
    return () => setSettings([]);
  }, [device?.id]);
  return { deviceType, setDeviceType, settings, setSettings };
};

export const useContext = () => React.useContext(Context);
