import React from 'react';
import { Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { Card, Descriptions, Grid, MetaCard } from '../../../components';
import { Device } from '../../../types/device';
import { Network } from '../../../types/network';
import { Topology } from '../../../network';
import { useBasisFields } from './sensorDetail';
import { DeviceStatus } from '../device-status';

export const GatewayDetail = ({ device, network }: { device: Device; network?: Network }) => {
  const basisFields = useBasisFields(device);

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
          <DeviceStatus device={device} />
          <Col span={24}>
            <MetaCard
              description={<Descriptions column={1} items={basisFields} />}
              title={intl.get('BASIC_INFORMATION')}
            />
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
