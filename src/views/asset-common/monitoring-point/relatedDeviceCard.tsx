import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { Card, Descriptions, TitleSection } from '../../../components';
import { SelfLink } from '../../../components/selfLink';
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
                      <SelfLink to={`/devices/${device.id}`}>{device.name}</SelfLink>
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
