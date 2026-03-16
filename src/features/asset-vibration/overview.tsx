import React from 'react';
import { Col } from 'antd';
import { Translation } from 'locales/utils';
import { Grid, MutedCard } from '../../components';
import { AssetRow, AlarmsObjectStatistics, AlarmTrend } from '../../asset-common';
import { SelectedPointPropertyHistory } from '../../asset-model';
import { SettingsDetail } from '../../asset-variant';
import { AssetAnnotationImage } from '../imageAnnotation';
import { FaultDiagnosis, FaultDiagnosisOverview } from 'features/vibration-fault-diagnosis';
import { shouldDisplayDiagnosis } from '.';

export const Overview = (props: {
  asset: AssetRow;
  onSuccess?: () => void;
  diagnosis?: FaultDiagnosis;
}) => {
  const { asset, onSuccess, diagnosis } = props;
  const number = asset.monitoringPoints?.length ?? 0;
  const should = shouldDisplayDiagnosis(asset) && !!diagnosis;

  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <Grid>
          {should && (
            <Col span={24}>
              <FaultDiagnosisOverview {...diagnosis} withComponentsList={true} />
            </Col>
          )}
          <Col span={24}>
            <AssetAnnotationImage
              asset={asset}
              title={Translation.get('monitoring.points')}
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
            <MutedCard title={Translation.get('common.basic')}>
              <SettingsDetail attributes={asset.attributes} type={asset.type} />
            </MutedCard>
          </Col>
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
