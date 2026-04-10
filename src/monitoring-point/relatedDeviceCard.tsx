import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { Descriptions, Link, MutedCard } from '../components';
import { SingleDeviceStatus } from '../device/SingleDeviceStatus';
import { toMac } from '../utils/format';
import * as MonitoringPoint from 'domain/monitoring-point';

export const RelatedDeviceCard = ({
  monitoringPoint
}: {
  monitoringPoint: MonitoringPoint.Types.Entity;
}) => {
  const { sensor } = monitoringPoint;
  return (
    sensor && (
      <MutedCard title={intl.get('SENSOR')}>
        <Descriptions
          items={[
            {
              label: intl.get('NAME'),
              children: (
                <Space>
                  <Link to={`/devices/${sensor.id}`}>{sensor.name}</Link>
                  <SingleDeviceStatus device={sensor} key={sensor.id} />
                </Space>
              )
            },
            { label: intl.get('MAC_ADDRESS'), children: toMac(sensor.macAddress.toUpperCase()) }
          ]}
        />
      </MutedCard>
    )
  );
};
