import { Col } from 'antd';
import { Grid, MutedCard } from 'components';
import React from 'react';
import { BasicCard } from './basicCard';
import { RelatedDeviceCard } from './relatedDeviceCard';
import intl from 'react-intl-universal';
import { RecentWeekMonitoringPointData } from 'features/characteristic-data';
import { MonitoringPoint } from 'common';
import { useGetSeriesAlarm } from './provider';

export const Overview = ({ monitoringPoint }: { monitoringPoint: MonitoringPoint }) => {
  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <MutedCard title={intl.get('real.time.data')}>
          <RecentWeekMonitoringPointData
            {...{ ...monitoringPoint, ...useGetSeriesAlarm() }}
            key={monitoringPoint.id}
          />
        </MutedCard>
      </Col>
      <Col flex='300px'>
        <Grid>
          <Col span={24}>
            <BasicCard monitoringPoint={monitoringPoint as any} />
          </Col>
          <Col span={24}>
            <RelatedDeviceCard monitoringPoint={monitoringPoint as any} />
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
