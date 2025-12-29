import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { Descriptions, Link, MutedCard } from '../components';
import { SingleDeviceStatus } from '../device/SingleDeviceStatus';
import { toMac } from '../utils/format';
import { transform } from 'common';
import { MonitoringPointRow } from 'asset-common';

export const RelatedDeviceCard = ({ monitoringPoint }: { monitoringPoint: MonitoringPointRow }) => {
  const { device } = transform(monitoringPoint);
  return (
    device && (
      <MutedCard title={intl.get('SENSOR')}>
        <Descriptions
          items={[
            {
              label: intl.get('NAME'),
              children: (
                <Space>
                  <Link to={`/devices/${device.id}`}>{device.name}</Link>
                  <SingleDeviceStatus device={device} key={device.id} />
                </Space>
              )
            },
            { label: intl.get('MAC_ADDRESS'), children: toMac(device.macAddress.toUpperCase()) }
          ]}
        />
      </MutedCard>
    )
  );
};
