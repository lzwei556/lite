import React from 'react';
import { Spin, Empty } from 'antd';
import { Translation } from 'locales/utils';
import { Card, TabsDetail, TabsDetailsItems } from '../../../components';
import { Device } from '../../../types/device';
import { DeviceType } from '../../../types/device_type';
import { Network } from '../../../types/network';
import { DeviceNavigator } from '../navigator';
import { useContext } from '..';
import { RuntimeChart } from '../RuntimeChart';
import { QueryEventTable } from '../event';
import { Index } from '../edit';
import { HistoryDataPage } from './historyData';
import { GatewayDetail } from './gatewayDetail';
import { SensorDetail } from './sensorDetail';
import { RouterDetail } from './router-detail';
import { HeadRight } from './head';
import { Permission, useCan } from '../../../providers/access-control';

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
    } else if (DeviceType.Router === typeId) {
      return <RouterDetail device={device} />;
    }
  }

  function useDeviceTabs(deviceTypeId?: number) {
    const tabs: TabsDetailsItems = [];
    const canReadDeviceData = useCan(Permission.DeviceData);
    const canReadDeviceRuntimeData = useCan(Permission.DeviceRuntimeDataGet);
    const canReadDeviceEvent = useCan(Permission.DeviceEventList);
    const canEditDeviceSettings = useCan(Permission.DeviceSettingsEdit);
    if (deviceTypeId === undefined) return [];
    if (canReadDeviceData) {
      tabs.push({
        key: 'overview',
        label: Translation.get('common.overview'),
        content: renderOverview(device, network)
      });
    }
    if (DeviceType.isSensor(deviceTypeId) && canReadDeviceData) {
      tabs.push({
        key: 'history',
        label: Translation.get('feature.history'),
        content: device && <HistoryDataPage device={device} key={device.id} />
      });
    } else if (DeviceType.isGateway(deviceTypeId) && canReadDeviceRuntimeData) {
      tabs.push({
        key: 'history',
        label: Translation.get('device.gateway.runtime'),
        content: device && <RuntimeChart device={device} key={device.id} />
      });
    }
    if (canReadDeviceEvent) {
      tabs.push({
        key: 'events',
        label: Translation.get('device.events'),
        content: device && <QueryEventTable device={device} key={device.id} />
      });
    }
    if (canEditDeviceSettings) {
      tabs.push({
        key: 'settings',
        label: Translation.get('common.settings'),
        content: device && (
          <Index
            device={device}
            onUpdate={() => refresh(device.id)}
            network={network}
            key={device.id}
          />
        )
      });
    }
    return tabs;
  }

  return (
    <Spin spinning={loading}>
      {device && (
        <TabsDetail
          items={tabs}
          title={<DeviceNavigator device={device} />}
          tabBarExtraContent={{
            right: <HeadRight device={device} network={network} />
          }}
        />
      )}
    </Spin>
  );
};

export default DeviceDetailPage;
