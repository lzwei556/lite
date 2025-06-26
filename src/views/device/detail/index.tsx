import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSize } from 'ahooks';
import { Button, Space as AntSpace, Spin, Empty } from 'antd';
import { DownloadOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { TabsProps } from 'antd/lib';
import intl from 'react-intl-universal';
import { Card, DeleteIconButton, IconButton, Tabs } from '../../../components';
import { DeleteNetworkRequest, ExportNetworkRequest } from '../../../apis/network';
import { Device } from '../../../types/device';
import { DeviceType } from '../../../types/device_type';
import { Network } from '../../../types/network';
import HasPermission from '../../../permission';
import userPermission, { Permission } from '../../../permission/permission';
import { useContext } from '..';
import { CommandDropdown } from '../commandDropdown';
import { SingleDeviceStatus } from '../SingleDeviceStatus';
import { RuntimeChart } from '../RuntimeChart';
import { AddModal } from '../add/modal';
import { DeviceNavigator } from '../navigator';
import DeviceEvent from './event';
import HistoryDataPage from './data';
import DownloadModal from './downloadModal';
import SettingPage from './setting';
import { GatewayDetail } from './gatewayDetail';
import { SensorDetail } from './sensorDetail';
import { DeleteDeviceRequest } from '../../../apis/device';

const DeviceDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { device, setDevice, network, loading, refresh } = useContext();
  const tabs = useDeviceTabs(device?.typeId);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

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
    } else {
      return <SensorDetail device={device} />;
    }
  }

  function useDeviceTabs(deviceTypeId?: number) {
    const tabs: TabsProps['items'] = [];
    const { hasPermission, hasPermissions } = userPermission();
    if (deviceTypeId === undefined) return [];
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
        children: device && <DeviceEvent device={device} />
      });
    }
    if (hasPermissions(Permission.DeviceSettingsGet, Permission.DeviceSettingsEdit)) {
      tabs.push({
        key: 'settings',
        label: intl.get('SETTINGS'),
        children: device && (
          <Card>
            <SettingPage device={device} onUpdate={() => refresh(device.id)} network={network} />
          </Card>
        )
      });
    }
    return tabs;
  }

  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return (
    <Spin spinning={loading}>
      {device && (
        <Tabs
          items={tabs}
          noStyle={true}
          tabBarExtraContent={{
            left: (
              <AntSpace style={{ marginRight: 30 }} size={30}>
                <DeviceNavigator id={device.id} containerDomWidth={size?.width} />
                <SingleDeviceStatus device={device} key={device.id} />
              </AntSpace>
            ),
            right: (
              <Button.Group style={{ marginLeft: 30 }}>
                {DeviceType.isGateway(device.typeId) && network && (
                  <>
                    <HasPermission value={Permission.NetworkExport}>
                      <IconButton title={intl.get('EXPORT_NETWORK')}>
                        <Button
                          type='primary'
                          onClick={() => {
                            ExportNetworkRequest(network.id).then((res) => {
                              const url = window.URL.createObjectURL(new Blob([res.data]));
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', `${network.name}.json`);
                              document.body.appendChild(link);
                              link.click();
                            });
                          }}
                          icon={<ExportOutlined />}
                        />
                      </IconButton>
                    </HasPermission>
                    <HasPermission value={Permission.NetworkDelete}>
                      <DeleteIconButton
                        confirmProps={{
                          description: intl.get('DELETE_SOMETHING_PROMPT', {
                            something: network.gateway.name
                          }),
                          onConfirm: () => {
                            DeleteNetworkRequest(network.id).then(() => {
                              refresh();
                              navigate(`/devices/0`);
                            });
                          },
                          placement: 'top'
                        }}
                        buttonProps={{
                          variant: 'solid',
                          color: 'primary',
                          size: 'middle',
                          type: 'primary'
                        }}
                        tooltipProps={{ placement: 'top' }}
                      />
                    </HasPermission>
                    <IconButton
                      title={intl.get('CREATE_SOMETHING', { something: intl.get('DEVICE') })}
                    >
                      <Button
                        type='primary'
                        onClick={() => setOpen2(true)}
                        icon={<PlusOutlined />}
                      />
                    </IconButton>
                    {open2 && (
                      <AddModal
                        open={open2}
                        onCancel={() => setOpen2(false)}
                        onSuccess={() => setOpen2(false)}
                      />
                    )}
                  </>
                )}
                {DeviceType.isRootDevice(device.typeId) && !DeviceType.isGateway(device.typeId) && (
                  <HasPermission value={Permission.DeviceDelete}>
                    <DeleteIconButton
                      confirmProps={{
                        description: intl.get('DELETE_SOMETHING_PROMPT', {
                          something: device.name
                        }),
                        onConfirm: () => {
                          DeleteDeviceRequest(device.id).then(() => {
                            refresh();
                            navigate(`/devices/0`);
                            setDevice(undefined);
                          });
                        },
                        placement: 'top'
                      }}
                      buttonProps={{
                        variant: 'solid',
                        color: 'primary',
                        size: 'middle',
                        type: 'primary'
                      }}
                      tooltipProps={{ placement: 'top' }}
                    />
                  </HasPermission>
                )}
                {DeviceType.isSensor(device.typeId) && (
                  <HasPermission value={Permission.DeviceData}>
                    <IconButton title={intl.get('DOWNLOAD_DATA')}>
                      <Button
                        type='primary'
                        onClick={() => setOpen(true)}
                        icon={<DownloadOutlined />}
                      />
                    </IconButton>
                    <DownloadModal
                      open={open}
                      onCancel={() => setOpen(false)}
                      device={device}
                      onSuccess={() => setOpen(false)}
                    />
                  </HasPermission>
                )}
                <HasPermission value={Permission.DeviceCommand}>
                  <CommandDropdown
                    device={device}
                    initialUpgradeCode={location.state}
                    network={network}
                  />
                </HasPermission>
              </Button.Group>
            )
          }}
          tabListRef={ref}
          tabsRighted={true}
        />
      )}
    </Spin>
  );
};

export default DeviceDetailPage;
