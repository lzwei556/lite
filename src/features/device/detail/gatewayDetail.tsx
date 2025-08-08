import React from 'react';
import { Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { Card, Descriptions, Grid, MutedCard } from '../../../components';
import { Device } from '../../../types/device';
import { Network } from '../../../types/network';
import { Topology } from '../../../network';
import { DeviceStatus } from '../device-status';
import { useBasisFields } from './sensorDetail';

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
            <MutedCard title={intl.get('BASIC_INFORMATION')}>
              <Descriptions column={1} items={basisFields} />
            </MutedCard>
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
