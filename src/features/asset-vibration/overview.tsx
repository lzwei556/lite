import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Grid, MutedCard } from '../../components';
import { AssetRow, AlarmsObjectStatistics, AlarmTrend } from '../../asset-common';
import { SelectedPointPropertyHistory } from '../../asset-model';
import { SettingsDetail } from '../../asset-variant';
import { AssetAnnotationImage } from '../imageAnnotation';
import DianJi from './dianji.png';

export const Overview = (props: { asset: AssetRow }) => {
  const { asset } = props;
  const number = asset.monitoringPoints?.length ?? 0;

  return (
    <Grid wrap={false} align='stretch'>
      <Col flex='auto'>
        <Grid style={{ height: '100%' }}>
          <Col span={24}>
            <AssetAnnotationImage
              asset={asset}
              backgroundImage={DianJi}
              key={`${asset.id}_${number}_${asset.image}`}
            />
          </Col>
          {number > 0 && (
            <Col span={24}>
              <SelectedPointPropertyHistory />
            </Col>
          )}
        </Grid>
      </Col>
      <Col flex='300px'>
        <Grid>
          <Col span={24}>
            <MutedCard title={intl.get('BASIC_INFORMATION')}>
              <SettingsDetail settings={asset.attributes} type={asset.type} />
            </MutedCard>
          </Col>
          <Col span={24}>
            <AlarmsObjectStatistics
              total={asset.statistics.monitoringPointNum}
              alarms={asset.statistics.alarmNum}
              title={intl.get('monitoring.points.statistics')}
              subtext={intl.get('monitoring.points.total')}
            />
          </Col>
          <Col span={24}>
            <AlarmTrend
              id={asset.id}
              title={intl.get('ALARM_TREND')}
              chartStyle={{ height: 210 }}
            />
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
