import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Grid, MutedCard } from 'components';
import { AlarmsObjectStatistics, AlarmTrend, AssetRow } from 'asset-common';
import { AssetAnnotationImage } from 'features/imageAnnotation';
import { SelectedPointPropertyHistory } from 'asset-model/selected-point-property-history';
import { FaultDiagnosis, FaultDiagnosisOverview } from 'features/vibration-fault-diagnosis';
import { shouldDisplayDiagnosis } from 'asset-primary';
import { PrimaryAssetSettingsDetail } from 'features/asset-settings';

export const Overview = (props: {
  asset: AssetRow;
  diagnosis?: FaultDiagnosis;
  onSuccess?: () => void;
}) => {
  const { asset, onSuccess } = props;
  const number = asset.monitoringPoints?.length ?? 0;
  const should = shouldDisplayDiagnosis(asset) && !!props.diagnosis;

  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <Grid>
          {should && (
            <Col span={24}>
              <FaultDiagnosisOverview {...props.diagnosis!} withComponentsList={true} />
            </Col>
          )}
          <Col span={24}>
            <AssetAnnotationImage
              asset={asset}
              title={intl.get('monitoring.points')}
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
            <MutedCard title={intl.get('BASIC_INFORMATION')}>
              <PrimaryAssetSettingsDetail attributes={asset.attributes} type={asset.type} />
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
