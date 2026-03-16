import React from 'react';
import { Col } from 'antd';
import { Translation } from 'locales/utils';
import { Grid } from '../../components';
import { AssetRow, AlarmsObjectStatistics, AlarmTrend } from '../../asset-common';
import { SelectedPointPropertyHistory } from '../../asset-model';
import { AssetAnnotationImage } from '../imageAnnotation';

export const Overview = (props: { asset: AssetRow; onSuccess?: () => void }) => {
  const { asset, onSuccess } = props;
  const number = asset.monitoringPoints?.length ?? 0;

  return (
    <Grid wrap={false} align='stretch'>
      <Col flex='auto'>
        <Grid style={{ height: '100%' }}>
          <Col span={24}>
            <AssetAnnotationImage
              asset={asset}
              key={`${asset.id}_${number}_${asset.image}`}
              onSuccess={onSuccess}
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
            <AlarmsObjectStatistics
              total={asset.statistics.monitoringPointNum}
              alarms={asset.statistics.alarmNum}
              title={Translation.get('monitoring.points')}
              subtext={Translation.get('common.total')}
            />
          </Col>
          <Col span={24}>
            <AlarmTrend
              id={asset.id}
              title={Translation.get('alarm.trend')}
              chartStyle={{ height: 210 }}
            />
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
