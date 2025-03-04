import React from 'react';
import { Col, Space as AntSpace, Avatar, Statistic, Empty } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Card, Descriptions, DescriptionsProps, Flex, Grid } from '../../../components';
import { SelfLink } from '../../../components/selfLink';
import { toMac } from '../../../utils/format';
import { DeviceType } from '../../../types/device_type';
import { Device } from '../../../types/device';
import { Network } from '../../../types/network';
import dayjs from '../../../utils/dayjsUtils';
import { Topology } from '../../network';

export const GatewayDetail = ({ device, network }: { device: Device; network?: Network }) => {
  const { macAddress, information, state } = device;
  const items: DescriptionsProps['items'] = [
    {
      key: 'mac',
      label: intl.get('MAC_ADDRESS'),
      children: toMac(macAddress.toUpperCase())
    },
    {
      key: 'type',
      label: intl.get('DEVICE_TYPE'),
      children: intl.get(DeviceType.toString(device.typeId))
    },
    {
      key: 'version',
      label: intl.get('FIRMWARE_VERSION'),
      children:
        information.firmware_version && information.product_id
          ? `${information.firmware_version}(${information.product_id})`
          : '-'
    },
    {
      key: 'time',
      label: intl.get('LAST_CONNECTION_TIME'),
      children: state.connectedAt
        ? dayjs(state.connectedAt * 1000).format('YYYY-MM-DD HH:mm:ss')
        : '-'
    }
  ];
  if (information.ip_address) {
    items.push({
      key: 'ip',
      label: intl.get('IP_ADDRESS'),
      children: (
        <SelfLink to={`http://${information.ip_address}`} target={'_blank'}>
          {information.ip_address}
        </SelfLink>
      )
    });
  }
  items.push({
    key: 'signal',
    label: intl.get('MOBILE_SIGNAL_STRENGTH'),
    children: state.signalLevel ? `${state.signalLevel} dBm` : '-'
  });
  if (information.iccid_4g) {
    items.push({ key: 'nuber', label: intl.get('4G_CARD_NO'), children: information.iccid_4g });
  }

  if (!network) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  return (
    <Grid>
      <Col flex='auto'>
        <Topology.Status network={network} key={network.gateway.macAddress} />
      </Col>
      <Col flex='300px'>
        <Grid>
          <Col span={24}>
            <Card title={intl.get('DEVICE_STATUS')}>
              <Flex align='center' justify='flex-start'>
                <AntSpace size={16}>
                  <Avatar
                    icon={<WifiOutlined />}
                    size={60}
                    style={{ color: '#333', backgroundColor: '#fff' }}
                  />
                  <Statistic
                    title={intl.get('MOBILE_SIGNAL_STRENGTH')}
                    value={state.signalLevel ?? '-'}
                  />
                </AntSpace>
              </Flex>
            </Card>
          </Col>
          <Col span={24}>
            <Card title={intl.get('BASIC_INFORMATION')}>
              <Descriptions column={1} items={items} />
            </Card>
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
