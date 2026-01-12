import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Grid } from 'components';
import { AlarmsObjectStatistics, AlarmTrend, AssetRow } from 'asset-common';
import { AssetAnnotationImage } from 'features/imageAnnotation';
import { SettingsDetail } from './settings-detail';
import { SelectedPointPropertyHistory } from 'asset-model/selected-point-property-history';

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
          <SettingsDetail attributes={asset.attributes} type={asset.type} />
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
