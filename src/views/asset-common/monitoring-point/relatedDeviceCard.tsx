import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { Card, Descriptions, TitleSection, Link } from '../../../components';
import { SingleDeviceStatus } from '../../device/SingleDeviceStatus';
import { toMac } from '../../../utils/format';
import { MonitoringPointRow } from './types';

export const RelatedDeviceCard = ({ bindingDevices = [] }: MonitoringPointRow) => {
  const device = bindingDevices[0];
  return (
    device && (
      <TitleSection
        title={intl.get('bindings.device')}
        body={
          <Card>
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
          </Card>
        }
      />
    )
  );
};
