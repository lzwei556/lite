import React from 'react';
import { Avatar, Col, Divider, Space, Statistic } from 'antd';
import Icon, { WifiOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { DeviceType } from '../../types/device_type';
import { Device } from '../../types/device';
import { MutedCard } from '../../components';
import { getValue } from '../../utils';
import { useGlobalStyles } from '../../styles';
import { ReactComponent as BatterySVG } from './battery.svg';

export const DeviceStatus = ({ device }: { device: Device }) => {
  const fields = useStateFields(device);
  const { colorBgContainerStyle, colorTextSecondaryStyle } = useGlobalStyles();
  return (
    fields.length > 0 && (
      <Col span={24}>
        <MutedCard title={intl.get('DEVICE_STATUS')}>
          <Space
            direction='vertical'
            split={<Divider style={{ marginBlock: 8 }} />}
            style={{ width: '100%' }}
          >
            {fields.map(({ label, value, icon, unit }) => (
              <Space size={16} key={label}>
                <Avatar
                  icon={icon}
                  size={60}
                  style={{ ...colorTextSecondaryStyle, ...colorBgContainerStyle }}
                />
                <Statistic
                  title={label}
                  value={value}
                  valueStyle={{ fontSize: 20 }}
                  suffix={unit}
                />
              </Space>
            ))}
          </Space>
        </MutedCard>
      </Col>
    )
  );
};

const useStateFields = (device: Device) => {
  const { typeId, state } = device;
  const fields = [];
  if (!DeviceType.isWiredDevice(typeId)) {
    const batteryVoltage = getValue({ value: state?.batteryVoltage });
    fields.push({
      label: intl.get('BATTERY_VOLTAGE'),
      value: batteryVoltage,
      icon: <Icon component={() => <BatterySVG width='1em' height='1em' fill='currentColor' />} />,
      unit: 'mV'
    });
  }
  if (!DeviceType.isWiredSensor(typeId)) {
    const signalLevel = getValue({ value: state?.signalLevel });
    fields.push({
      label: DeviceType.isGateway(typeId)
        ? intl.get('MOBILE_SIGNAL_STRENGTH')
        : intl.get('SIGNAL_STRENGTH'),
      value: signalLevel,
      icon: <WifiOutlined />,
      unit: 'dBm'
    });
  }
  return fields;
};
