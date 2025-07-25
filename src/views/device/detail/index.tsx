import React from 'react';
import { useSize } from 'ahooks';
import { Spin, Empty } from 'antd';
import { TabsProps } from 'antd/lib';
import intl from 'react-intl-universal';
import { Card, Tabs } from '../../../components';
import { Device } from '../../../types/device';
import { DeviceType } from '../../../types/device_type';
import { Network } from '../../../types/network';
import userPermission, { Permission } from '../../../permission/permission';
import { useContext } from '..';
import { RuntimeChart } from '../RuntimeChart';
import HistoryDataPage from './data';
import { GatewayDetail } from './gatewayDetail';
import { SensorDetail } from './sensorDetail';
import { QueryEventTable } from '../event';
import { Index } from '../edit';
import { RouterDetail } from './router-detail';
import { HeadLeft, HeadRight } from './head';

const DeviceDetailPage = () => {
  const { device, network, loading, refresh } = useContext();
  const tabs = useDeviceTabs(device?.typeId);

  function renderOverview(device?: Device, network?: Network) {
    if (!device) {
      return (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    }
    const { typeId } = device;
    if (DeviceType.isGateway(typeId)) {
      return <GatewayDetail device={device} network={network} />;
    } else if (DeviceType.isSensor(typeId)) {
      return <SensorDetail device={device} />;
    }
  }

  function useDeviceTabs(deviceTypeId?: number) {
    const tabs: TabsProps['items'] = [];
    const { hasPermission, hasPermissions } = userPermission();
    if (deviceTypeId === undefined || deviceTypeId === DeviceType.Router) return [];
    if (hasPermission(Permission.DeviceData)) {
      tabs.push({
        key: 'overview',
        label: intl.get('OVERVIEW'),
        children: renderOverview(device, network)
      });
    }
    if (DeviceType.isSensor(deviceTypeId) && hasPermission(Permission.DeviceData)) {
      tabs.push({
        key: 'historyData',
        label: intl.get('HISTORY_DATA'),
        children: device && <HistoryDataPage device={device} />
      });
    } else if (
      DeviceType.isGateway(deviceTypeId) &&
      hasPermission(Permission.DeviceRuntimeDataGet)
    ) {
      tabs.push({
        key: 'status',
        label: intl.get('STATUS_HISTORY'),
        children: device && <RuntimeChart device={device} />
      });
    }
    if (hasPermission(Permission.DeviceEventList)) {
      tabs.push({
        key: 'events',
        label: intl.get('EVENTS'),
        children: device && <QueryEventTable device={device} />
      });
    }
    if (hasPermissions(Permission.DeviceSettingsGet, Permission.DeviceSettingsEdit)) {
      tabs.push({
        key: 'settings',
        label: intl.get('SETTINGS'),
        children: device && (
          <Index device={device} onUpdate={() => refresh(device.id)} network={network} />
        )
      });
    }
    return tabs;
  }

  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return (
    <Spin spinning={loading}>
      {device &&
        (device.typeId === DeviceType.Router ? (
          <RouterDetail device={device} onSuccess={() => refresh(device.id)} />
        ) : (
          <Tabs
            items={tabs}
            noStyle={true}
            tabBarExtraContent={{
              left: <HeadLeft device={device} size={size} />,
              right: <HeadRight device={device} network={network} />
            }}
            tabListRef={ref}
            tabsRighted={true}
          />
        ))}
    </Spin>
  );
};

export default DeviceDetailPage;
