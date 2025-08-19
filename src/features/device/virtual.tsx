import React from 'react';
import { Button, Col, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ImportOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { Card, Grid, IconButton, Link, MutedCard, Table, TitleExtraLayout } from '../../components';
import { Dayjs, getDisplayName, getValue, toMac } from '../../utils';
import { Device } from '../../types/device';
import { DeviceType } from '../../types/device_type';
import { getProject } from '../../utils/session';
import { SingleDeviceStatus } from '../../device/SingleDeviceStatus';
import { useLocaleContext } from '../../localeProvider';
import { DeviceNS } from './util';
import { useContext } from '.';

export const VIRTUAL_ROOT_DEVICE = {
  macAddress: '000000000000',
  id: 0,
  name: getProject().name
};

export default function Virtual() {
  const { devices } = useContext();
  const navigate = useNavigate();
  const { language } = useLocaleContext();

  const renderBody = () => {
    if (devices.length === 0) {
      return (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    } else {
      return (
        <Grid>
          <Col span={24}>
            <MutedCard title={intl.get('gateways')}>
              <Table
                bordered={true}
                cardProps={{ bordered: false, styles: { body: { padding: 0 } } }}
                columns={[
                  {
                    dataIndex: 'name',
                    key: 'name',
                    title: intl.get('DEVICE_NAME'),
                    render: (name: string, device: Device) => (
                      <Link to={`/devices/${device.id}`}>{name}</Link>
                    )
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
                    key: 'sensors',
                    title: intl.get('sensors'),
                    children: [
                      {
                        key: 'online',
                        title: intl.get('ONLINE'),
                        render: (_: string, device: Device) => {
                          return DeviceNS.Children.getOnlineStatusCount(device, devices).online;
                        }
                      },
                      {
                        key: 'offline',
                        title: intl.get('OFFLINE'),
                        render: (_: string, device: Device) => {
                          return DeviceNS.Children.getOnlineStatusCount(device, devices).offline;
                        }
                      }
                    ]
                  },
                  {
                    key: 'time',
                    title: intl.get('LAST_CONNECTION_TIME'),
                    render: (_: string, device: Device) => {
                      return device.state?.connectedAt
                        ? Dayjs.format(device.state?.connectedAt)
                        : '-';
                    }
                  }
                ]}
                dataSource={devices.filter((device) => DeviceType.isGateway(device.typeId))}
              />
            </MutedCard>
          </Col>
          <Col span={24}>
            <MutedCard title={intl.get('sensors')}>
              <Table
                bordered={true}
                cardProps={{ bordered: false, styles: { body: { padding: 0 } } }}
                columns={[
                  {
                    dataIndex: 'name',
                    key: 'name',
                    title: intl.get('DEVICE_NAME'),
                    render: (name: string, device: Device) => (
                      <Link to={`/devices/${device.id}`}>{name}</Link>
                    )
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
                    title: getDisplayName({
                      name: intl.get('BATTERY_VOLTAGE'),
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
                      name: intl.get('SIGNAL_STRENGTH'),
                      lang: language,
                      suffix: 'dBm'
                    }),
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
                ]}
                dataSource={devices.filter((device) => DeviceType.isSensor(device.typeId))}
              />
            </MutedCard>
          </Col>
        </Grid>
      );
    }
  };

  return (
    <Grid>
      <Col span={24}>
        <TitleExtraLayout
          title={VIRTUAL_ROOT_DEVICE.name}
          extra={
            <Button.Group>
              <HasPermission value={Permission.NetworkAdd}>
                <IconButton
                  icon={<ImportOutlined />}
                  onClick={() => navigate('/devices/import')}
                  tooltipProps={{ title: intl.get('MENU_IMPORT_NETWORK') }}
                  type='primary'
                  variant='solid'
                />
              </HasPermission>
              <IconButton
                icon={<PlusOutlined />}
                onClick={() => navigate('/devices/0/create', { state: { from: '/devices/0' } })}
                tooltipProps={{
                  title: intl.get('CREATE_SOMETHING', { something: intl.get('DEVICE') })
                }}
                type='primary'
                variant='solid'
              />
            </Button.Group>
          }
          paddingBlock={14}
        />
      </Col>
      <Col span={24}>{renderBody()}</Col>
    </Grid>
  );
}
