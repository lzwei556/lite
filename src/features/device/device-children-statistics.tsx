import React from 'react';
import { Col, Statistic } from 'antd';
import intl from 'react-intl-universal';
import { Device } from '../../types/device';
import { Grid, MutedCard } from '../../components';

export const DeviceChildrenStatistics = ({ devices }: { devices: Device[] }) => {
  const fields = useStatisticsFields(devices);
  return (
    <Col span={24}>
      <MutedCard title={intl.get('sensors.number')}>
        <Grid>
          {fields.map(({ label, value }) => (
            <Col span={8} key={label}>
              <Statistic title={label} value={value} />
            </Col>
          ))}
        </Grid>
      </MutedCard>
    </Col>
  );
};

const useStatisticsFields = (devices: Device[]) => {
  const fields = [];
  const total = devices.length;
  const onlines = devices.filter((d) => !!d.state?.isOnline).length;
  fields.push({
    label: intl.get('total'),
    value: devices.length
  });
  fields.push({
    label: intl.get('ONLINE'),
    value: devices.filter((d) => !!d.state?.isOnline).length
  });
  fields.push({
    label: intl.get('OFFLINE'),
    value: total - onlines
  });
  return fields;
};
