import React from 'react';
import { Badge, Button, Col, Empty, Space, Statistic, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ImportOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { Card, Flex, Grid, IconButton, Link, TitleExtraLayout } from '../../components';
import { generateColProps } from '../../utils/grid';
import { Dayjs } from '../../utils';
import { Device } from '../../types/device';
import { DeviceType } from '../../types/device_type';
import { getProject } from '../../utils/session';
import { DeviceNS, getValueOfFirstClassProperty } from './util';
import { useContext } from '.';

export const VIRTUAL_ROOT_DEVICE = {
  macAddress: '000000000000',
  id: 0,
  name: getProject().name
};

export default function Virtual() {
  const { devices } = useContext();
  const navigate = useNavigate();

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
          {devices.filter(DeviceNS.Assert.isRoot).map((d) => {
            const { id, name, state } = d;
            const isOnline = state && state.isOnline;
            const connectedAt = state && state.connectedAt;
            const channel = d.data?.values?.channel;

            return (
              <Col key={id} {...generateColProps({ md: 12, lg: 12, xl: 12, xxl: 8 })}>
                <Link to={`/devices/${id}`}>
                  <Card size='small' hoverable={true}>
                    <Flex justify='space-between'>
                      {name}
                      {channel ? ` (${intl.get('CHANNEL')}${channel})` : undefined}
                      <Badge
                        text={isOnline ? intl.get('ONLINE') : intl.get('OFFLINE')}
                        status={isOnline ? 'success' : 'default'}
                        size='small'
                      />
                    </Flex>
                    <div style={{ paddingBlock: 20, textAlign: 'center' }}>
                      <DataBar device={d} devices={devices} />
                    </div>
                    <Card.Meta
                      description={
                        <Space>
                          {intl.get('LAST_CONNECTION_TIME')}
                          <span>{connectedAt ? Dayjs.format(state.connectedAt) : '-'}</span>
                        </Space>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            );
          })}
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

function DataBar({ device, devices }: { device: Device; devices: Device[] }) {
  const renderTitle = (name: string) => {
    return (
      <Typography.Text style={{ whiteSpace: 'nowrap' }} ellipsis={true} title={name}>
        {name}
      </Typography.Text>
    );
  };
  if (DeviceType.isRootSensor(device.typeId)) {
    const datas = getValueOfFirstClassProperty(device);
    return (
      <Grid>
        {datas.map(({ name, value2, unit }) => (
          <Col span={8} key={name}>
            <Statistic value={value2} title={renderTitle(intl.get(name))} suffix={unit} />
          </Col>
        ))}
      </Grid>
    );
  } else {
    const count = DeviceNS.Children.getOnlineStatusCount(device, devices);
    return (
      <Grid justify='center'>
        <Col span={8}>
          <Statistic value={count.online} title={renderTitle(intl.get('ONLINE'))} />
        </Col>
        <Col span={8}>
          <Statistic value={count.offline} title={renderTitle(intl.get('OFFLINE'))} />
        </Col>
      </Grid>
    );
  }
}
