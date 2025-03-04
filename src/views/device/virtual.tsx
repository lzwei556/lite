import React from 'react';
import { Badge, Button, Col, Empty, Space, Statistic } from 'antd';
import { ImportOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { useContext, VIRTUAL_ROOT_DEVICE } from '.';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { SelfLink } from '../../components/selfLink';
import { Card, Flex, Grid } from '../../components';
import { DeviceNS, getValueOfFirstClassProperty } from './util';
import { generateColProps } from '../../utils/grid';
import dayjs from '../../utils/dayjsUtils';
import { AddModal } from './add/modal';
import { Device } from '../../types/device';
import { DeviceType } from '../../types/device_type';

export const Virtual = () => {
  const { devices } = useContext();
  const [open, setOpen] = React.useState(false);

  const renderBody = () => {
    if (devices.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    } else {
      return (
        <Grid>
          {devices.filter(DeviceNS.Assert.isRoot).map((d) => {
            const { id, name, state } = d;
            const isOnline = state && state.isOnline;
            const connectedAt = state && state.connectedAt;
            const channel = d.data?.values?.channel;

            return (
              <Col key={id} {...generateColProps({ md: 12, lg: 12, xl: 8, xxl: 6 })}>
                <SelfLink to={`/devices/${id}`}>
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
                    <div style={{ padding: 20, textAlign: 'center' }}>
                      <DataBar device={d} devices={devices} />
                    </div>
                    <Card.Meta
                      description={
                        <Space>
                          {intl.get('LAST_CONNECTION_TIME')}
                          <span>
                            {connectedAt
                              ? dayjs.unix(state.connectedAt).local().format('YYYY-MM-DD HH:mm:ss')
                              : '-'}
                          </span>
                        </Space>
                      }
                    />
                  </Card>
                </SelfLink>
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
            <SelfLink to='/devices/import'>
              <Button type='primary'>
                {intl.get('MENU_IMPORT_NETWORK')}
                <ImportOutlined />
              </Button>
            </SelfLink>
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
  if (DeviceType.isMultiChannel(device.typeId)) {
    const datas = getValueOfFirstClassProperty(device);
    return (
      <Grid>
        {datas.map(({ name, value2, unit }) => (
          <Col span={8} key={name}>
            <Statistic value={value2} title={intl.get(name)} suffix={unit} />
          </Col>
        ))}
      </Grid>
    );
  } else {
    const count = DeviceNS.Children.getOnlineStatusCount(device, devices);
    return (
      <Grid justify='center'>
        <Col span={8}>
          <Statistic value={count.online} title={intl.get('ONLINE')} />
        </Col>
        <Col span={8}>
          <Statistic value={count.offline} title={intl.get('OFFLINE')} />
        </Col>
      </Grid>
    );
  }
}
