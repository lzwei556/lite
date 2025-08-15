import React from 'react';
import intl from 'react-intl-universal';
import { Col } from 'antd';
import { Device } from '../../../types/device';
import { useLocaleContext } from '../../../localeProvider';
import { Descriptions, Grid, MutedCard } from '../../../components';
import { Topology } from '../../../network';
import { DeviceStatus } from '../device-status';
import { useBasisFields } from './sensorDetail';

export const RouterDetail = ({ device }: { device: Device }) => {
  const basisFields = useBasisFields(device);
  const { language } = useLocaleContext();

  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <Topology.Status device={device} key={device.macAddress} />
      </Col>
      <Col flex='300px'>
        <Grid>
          <DeviceStatus device={device} />
          <Col span={24}>
            <MutedCard title={intl.get('BASIC_INFORMATION')}>
              <Descriptions
                column={1}
                contentStyle={{
                  justifyContent: language === 'en-US' ? 'flex-start' : 'flex-end'
                }}
                items={basisFields}
                layout={language === 'en-US' ? 'vertical' : 'horizontal'}
              />
            </MutedCard>
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
