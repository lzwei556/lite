import React from 'react';
import { Translation } from 'locales/utils';
import { Col } from 'antd';
import { Device } from '../../../types/device';
import { Descriptions, Grid, MutedCard } from '../../../components';
import { Topology } from '../../../network';
import { DeviceStatus } from '../device-status';
import { useBasisFields } from './sensorDetail';

export const RouterDetail = ({ device }: { device: Device }) => {
  const basisFields = useBasisFields(device);

  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <Topology.Status device={device} key={device.macAddress} />
      </Col>
      <Col flex='300px'>
        <Grid>
          <DeviceStatus device={device} />
          <Col span={24}>
            <MutedCard title={Translation.get('common.basic')}>
              <Descriptions
                column={1}
                contentStyle={{ justifyContent: 'flex-start' }}
                items={basisFields}
                layout='vertical'
              />
            </MutedCard>
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
