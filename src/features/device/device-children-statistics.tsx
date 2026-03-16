import React from 'react';
import { Col, Statistic } from 'antd';
import { Translation } from 'locales/utils';
import { Device } from '../../types/device';
import { Grid, MutedCard } from '../../components';

export const DeviceChildrenStatistics = ({ devices }: { devices: Device[] }) => {
  const fields = useStatisticsFields(devices);
  return (
    <Col span={24}>
      <MutedCard title={Translation.get('device.network.nodes.total')}>
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
    label: Translation.get('common.total'),
    value: devices.length
  });
  fields.push({
    label: Translation.get('device.status.online'),
    value: devices.filter((d) => !!d.state?.isOnline).length
  });
  fields.push({
    label: Translation.get('device.status.offline'),
    value: total - onlines
  });
  return fields;
};
