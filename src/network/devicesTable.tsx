import React from 'react';
import { Translation } from 'locales/utils';
import { Device } from '../types/device';
import { useDeviceOnlineLiving, useDeviceTreeData } from '../features/device/deviceTree';
import { tree2List } from '../utils/tree';
import { SingleDeviceStatus } from '../device/SingleDeviceStatus';
import { Link, Table } from '../components';
import { Dayjs, getValue, toMac } from '../utils';
import { useI18n } from 'providers/i18n';
import { getDisplayName } from 'locales/utils';

export const DevicesTable = ({ device }: { device: Device }) => {
  useDeviceOnlineLiving();
  const { language } = useI18n();

  const dataSource = tree2List(useDeviceTreeData(device)).filter(
    (d) => d.macAddress !== device.macAddress
  );

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: Translation.get('device.name'),
      render: (name: string, device: Device) => <Link to={`/devices/${device.id}`}>{name}</Link>
    },
    {
      dataIndex: 'macAddress',
      key: 'mac',
      title: Translation.get('device.mac-address'),
      render: (mac: string) => toMac(mac.toUpperCase())
    },
    {
      key: 'state',
      title: Translation.get('common.status'),
      render: (_: string, device: Device) => {
        return <SingleDeviceStatus device={device} />;
      }
    },
    {
      key: 'battery',
      title: getDisplayName({
        name: Translation.get('device.status.battery.voltage'),
        lang: language,
        suffix: 'mV'
      }),
      render: (_: string, device: Device) => {
        return getValue({ value: device.state?.batteryVoltage });
      }
    },
    {
      key: 'signal',
      title: getDisplayName({
        name: Translation.get('device.status.signal.level'),
        lang: language,
        suffix: 'dBm'
      }),
      render: (_: string, device: Device) => {
        return getValue({ value: device.state?.signalLevel });
      }
    },
    {
      key: 'time',
      title: Translation.get('device.data.timestamp'),
      render: (_: string, device: Device) => {
        return device.data?.timestamp ? Dayjs.format(device.data?.timestamp) : '-';
      }
    }
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey={(row) => row.id} />;
};
