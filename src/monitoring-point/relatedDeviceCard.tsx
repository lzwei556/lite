import React from 'react';
import { Space } from 'antd';
import { Translation } from 'locales/utils';
import { Descriptions, Link, MutedCard } from '../components';
import { SingleDeviceStatus } from '../device/SingleDeviceStatus';
import { toMac } from '../utils/format';
import { transform } from 'common';
import { MonitoringPointRow } from 'asset-common';

export const RelatedDeviceCard = ({ monitoringPoint }: { monitoringPoint: MonitoringPointRow }) => {
  const { device } = transform(monitoringPoint as any);
  return (
    device && (
      <MutedCard title={Translation.get('device.sensor')}>
        <Descriptions
          items={[
            {
              label: Translation.get('common.name'),
              children: (
                <Space>
                  <Link to={`/devices/${device.id}`}>{device.name}</Link>
                  <SingleDeviceStatus device={device} key={device.id} />
                </Space>
              )
            },
            {
              label: Translation.get('device.mac-address'),
              children: toMac(device.macAddress.toUpperCase())
            }
          ]}
          contentStyle={{ justifyContent: 'flex-start' }}
          layout='vertical'
        />
      </MutedCard>
    )
  );
};
