import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { Descriptions, Link, MetaCard } from '../../../components';
import { SingleDeviceStatus } from '../../device/SingleDeviceStatus';
import { toMac } from '../../../utils/format';
import { MonitoringPointRow } from './types';

export const RelatedDeviceCard = ({ bindingDevices = [] }: MonitoringPointRow) => {
  const device = bindingDevices[0];
  return (
    device && (
      <MetaCard
        description={
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
        }
        title={intl.get('bindings.device')}
      />
    )
  );
};
