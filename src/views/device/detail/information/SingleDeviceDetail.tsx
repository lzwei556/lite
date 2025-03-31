import * as React from 'react';
import { Typography } from 'antd';
import intl from 'react-intl-universal';
import { Dayjs } from '../../../../utils';
import { Device } from '../../../../types/device';
import { DeviceType } from '../../../../types/device_type';
import { getDisplayName, toMac } from '../../../../utils/format';
import { useLocaleContext } from '../../../../localeProvider';
import { Term } from '../../../../components/term';
import { Card, Descriptions } from '../../../../components';

export const SingleDeviceDetail: React.FC<{ device: Device }> = ({ device }) => {
  const { language } = useLocaleContext();
  const items: { name: React.ReactNode; value: React.ReactNode }[] = [
    {
      name: intl.get('MAC_ADDRESS'),
      value: (
        <Typography.Text
          copyable={{
            text: device.macAddress,
            tooltips: [intl.get('COPY'), intl.get('COPY_SUCCEEDED')]
          }}
        >
          {toMac(device.macAddress.toUpperCase())}
        </Typography.Text>
      )
    },
    {
      name: intl.get('DEVICE_TYPE'),
      value: intl.get(DeviceType.toString(device.typeId))
    }
  ];
  const { firmware_version, product_id } = device.information;
  items.push({
    name: intl.get('FIRMWARE_VERSION'),
    value: firmware_version && product_id ? `${firmware_version}(${product_id})` : '-'
  });
  if (device.parentName && device.parentName.length > 0) {
    items.push({
      name: intl.get('PARENT'),
      value: device.parentName
    });
  }
  if (device.state && !DeviceType.isWiredDevice(device.typeId)) {
    items.push({
      name: getDisplayName({ name: intl.get('BATTERY_VOLTAGE'), lang: language, suffix: 'mV' }),
      value: device.state ? device.state.batteryVoltage : '-'
    });
  }
  if (!DeviceType.isWiredSensor(device.typeId)) {
    items.push({
      name: (
        <Term
          name={getDisplayName({
            name: DeviceType.isGateway(device.typeId)
              ? intl.get('MOBILE_SIGNAL_STRENGTH')
              : intl.get('SIGNAL_STRENGTH'),
            lang: language,
            suffix: 'dBm'
          })}
          description={
            DeviceType.isGateway(device.typeId)
              ? intl.get('MOBILE_SIGNAL_STRENGTH_DESC')
              : intl.get('SIGNAL_STRENGTH_DESC')
          }
        />
      ),
      value: device.state ? device.state.signalLevel : '-'
    });
  }

  items.push({
    name: intl.get('LAST_CONNECTION_TIME'),
    value: device.state.connectedAt ? Dayjs.format(device.state.connectedAt) : '-'
  });

  if (DeviceType.isSensor(device.typeId)) {
    items.push({
      name: intl.get('LAST_SAMPLING_TIME'),
      value:
        device.data && device.data.timestamp && device.data.timestamp > 0
          ? Dayjs.format(device.data.timestamp)
          : '-'
    });
  }
  return (
    <Card>
      <Descriptions
        bordered={true}
        column={{ xxl: 3, xl: 3, lg: 2, md: 2, xs: 1 }}
        items={items.map(({ name, value }) => ({
          label: name,
          children: value
        }))}
      />
    </Card>
  );
};
