import { Select, SelectProps, Typography } from 'antd';
import * as React from 'react';
import { Device } from '../../types/device';
import { GetDevicesRequest } from '../../apis/device';
import { toMac } from '../../utils/format';
import { useAppType } from '../../config';

export const DeviceSelect = ({
  types,
  dispalyField = 'id',
  ...rest
}: SelectProps & { types: number[]; dispalyField?: keyof Pick<Device, 'id' | 'macAddress'> }) => {
  const appType = useAppType();
  const [devices, setDevices] = React.useState<Device[]>([]);

  React.useEffect(() => {
    GetDevicesRequest({ types: types.join() }).then(setDevices);
  }, [types]);

  return (
    <Select
      {...rest}
      options={devices.map((d) => ({
        value: d[dispalyField],
        label: d.name,
        macAddress: d.macAddress
      }))}
      optionRender={(option) => (
        <>
          <Typography.Text strong>{option.data.label}</Typography.Text>
          <br />
          {appType !== 'corrosionWirelessHART' && (
            <Typography.Text type={'secondary'}>
              {toMac(option.data.macAddress.toUpperCase())}
            </Typography.Text>
          )}
        </>
      )}
    />
  );
};
