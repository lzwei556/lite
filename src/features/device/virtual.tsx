import React from 'react';
import { Button, Col, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Grid, IconButton, Link, MutedCard, Table, TitleExtraLayout } from '../../components';
import { Dayjs, getValue, toMac } from '../../utils';
import { Device } from '../../types/device';
import { DeviceType } from '../../types/device_type';
import { SingleDeviceStatus } from '../../device/SingleDeviceStatus';
import { DeviceNS } from './util';
import { useContext } from '.';
import { useSelectedProject } from '../../providers/user-profile';
import { CanAccess, Permission } from '../../providers/access-control';
import { getDisplayName, Translation } from 'locales/utils';
import { useI18n } from 'providers/i18n';

export const useVirtualRootDevice = () => {
  const selectedProject = useSelectedProject();
  return { macAddress: '000000000000', id: 0, name: selectedProject?.name };
};

export default function Virtual() {
  const { devices } = useContext();
  const navigate = useNavigate();
  const { language } = useI18n();
  const rootDevice = useVirtualRootDevice();

  const renderBody = () => {
    if (devices.length === 0) {
      return (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    } else {
      const gateways = devices.filter((device) => DeviceType.isGateway(device.typeId));
      const sensors = devices.filter((device) => DeviceType.isSensor(device.typeId));
      return (
        <Grid>
          {gateways.length > 0 && (
            <Col span={24}>
              <MutedCard title={Translation.get('device.gateways')}>
                <Table
                  bordered={true}
                  cardProps={{ bordered: false, styles: { body: { padding: 0 } } }}
                  columns={[
                    {
                      dataIndex: 'name',
                      key: 'name',
                      title: Translation.get('device.name'),
                      render: (name: string, device: Device) => (
                        <Link to={`/devices/${device.id}`}>{name}</Link>
                      )
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
                      key: 'sensors',
                      title: Translation.get('device.sensors'),
                      children: [
                        {
                          key: 'online',
                          title: Translation.get('device.status.online'),
                          render: (_: string, device: Device) => {
                            return DeviceNS.Children.getOnlineStatusCount(device, devices).online;
                          }
                        },
                        {
                          key: 'offline',
                          title: Translation.get('device.status.offline'),
                          render: (_: string, device: Device) => {
                            return DeviceNS.Children.getOnlineStatusCount(device, devices).offline;
                          }
                        }
                      ]
                    },
                    {
                      key: 'time',
                      title: Translation.get('device.status.connected-at'),
                      render: (_: string, device: Device) => {
                        return device.state?.connectedAt
                          ? Dayjs.format(device.state?.connectedAt)
                          : '-';
                      }
                    }
                  ]}
                  dataSource={gateways}
                />
              </MutedCard>
            </Col>
          )}
          {sensors.length > 0 && (
            <Col span={24}>
              <MutedCard title={Translation.get('device.sensors')}>
                <Table
                  bordered={true}
                  cardProps={{ bordered: false, styles: { body: { padding: 0 } } }}
                  columns={[
                    {
                      dataIndex: 'name',
                      key: 'name',
                      title: Translation.get('device.name'),
                      render: (name: string, device: Device) => (
                        <Link to={`/devices/${device.id}`}>{name}</Link>
                      )
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
                  ]}
                  dataSource={sensors}
                />
              </MutedCard>
            </Col>
          )}
        </Grid>
      );
    }
  };

  return (
    <Grid>
      <Col span={24}>
        <TitleExtraLayout
          title={rootDevice.name}
          extra={
            <Button.Group>
              <CanAccess {...Permission.NetworkAdd}>
                <IconButton
                  icon={<ImportOutlined />}
                  onClick={() => navigate('/devices/import')}
                  tooltipProps={{
                    title: Translation.doSth('common.action.import', 'device.network')
                  }}
                  type='primary'
                  variant='solid'
                />
              </CanAccess>
              <CanAccess {...Permission.DeviceAdd}>
                <IconButton
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/devices/0/create', { state: { from: '/devices/0' } })}
                  tooltipProps={{
                    title: Translation.createSth('device')
                  }}
                  type='primary'
                  variant='solid'
                />
              </CanAccess>
            </Button.Group>
          }
          paddingBlock={14}
        />
      </Col>
      <Col span={24}>{renderBody()}</Col>
    </Grid>
  );
}
