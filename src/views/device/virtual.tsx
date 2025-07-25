import React from 'react';
import { Badge, Button, Col, Empty, Space, Statistic, Typography } from 'antd';
import { ImportOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { useContext, VIRTUAL_ROOT_DEVICE } from '.';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { Card, Flex, Grid, Link } from '../../components';
import { DeviceNS, getValueOfFirstClassProperty } from './util';
import { generateColProps } from '../../utils/grid';
import { Dayjs } from '../../utils';
import { AddModal } from './add/modal';
import { Device } from '../../types/device';
import { DeviceType } from '../../types/device_type';

export const Virtual = () => {
  const { devices } = useContext();
  const [open, setOpen] = React.useState(false);

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
    <Card
      extra={
        <Space>
          <HasPermission value={Permission.NetworkAdd}>
            <Link to='/devices/import'>
              <Button type='primary'>
                {intl.get('MENU_IMPORT_NETWORK')}
                <ImportOutlined />
              </Button>
            </Link>
          </HasPermission>
          <Button type='primary' onClick={() => setOpen(true)}>
            {intl.get('CREATE_SOMETHING', { something: intl.get('DEVICE') })}
            <PlusOutlined />
          </Button>
          {open && (
            <AddModal
              open={open}
              onCancel={() => setOpen(false)}
              onSuccess={() => setOpen(false)}
            />
          )}
        </Space>
      }
      style={{ backgroundColor: 'transparent' }}
      styles={{ header: { backgroundColor: '#fff' }, body: { padding: 0 } }}
      title={VIRTUAL_ROOT_DEVICE.name}
    >
      {renderBody()}
    </Card>
  );
};

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
