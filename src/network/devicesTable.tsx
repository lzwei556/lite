import React from 'react';
import intl from 'react-intl-universal';
import { Device } from '../types/device';
import { useDeviceOnlineLiving, useDeviceTreeData } from '../features/device/deviceTree';
import { tree2List } from '../utils/tree';
import { SingleDeviceStatus } from '../device/SingleDeviceStatus';
import { Link, Table } from '../components';
import { Dayjs, getDisplayName, getValue, toMac } from '../utils';
import { useLocaleContext } from '../localeProvider';

export const DevicesTable = ({ device }: { device: Device }) => {
  useDeviceOnlineLiving();
  const { language } = useLocaleContext();

  const dataSource = tree2List(useDeviceTreeData(device)).filter(
    (d) => d.macAddress !== device.macAddress
  );

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: intl.get('DEVICE_NAME'),
      render: (name: string, device: Device) => <Link to={`/devices/${device.id}`}>{name}</Link>
    },
    {
      dataIndex: 'macAddress',
      key: 'mac',
      title: intl.get('MAC_ADDRESS'),
      render: (mac: string) => toMac(mac.toUpperCase())
    },
    {
      key: 'state',
      title: intl.get('STATUS'),
      render: (_: string, device: Device) => {
        return <SingleDeviceStatus device={device} />;
      }
    },
    {
      key: 'battery',
      title: getDisplayName({ name: intl.get('BATTERY_VOLTAGE'), lang: language, suffix: 'mV' }),
      render: (_: string, device: Device) => {
        return getValue({ value: device.state?.batteryVoltage });
      }
    },
    {
      key: 'signal',
      title: getDisplayName({ name: intl.get('SIGNAL_STRENGTH'), lang: language, suffix: 'dBm' }),
      render: (_: string, device: Device) => {
        return getValue({ value: device.state?.signalLevel });
      }
    },
    {
      key: 'time',
      title: intl.get('LAST_SAMPLING_TIME'),
      render: (_: string, device: Device) => {
        return device.data?.timestamp ? Dayjs.format(device.data?.timestamp) : '-';
      }
    }
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey={(row) => row.id} />;
};
