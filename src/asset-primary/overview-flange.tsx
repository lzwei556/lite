import { Col } from 'antd';
import {
  AlarmsObjectStatistics,
  AssetRow,
  EmptyMonitoringPoints,
  SensorsStatistics
} from 'asset-common';
import { isFlangePreloadCalculationEnabled } from 'common/asset-category';
import { Grid, MutedCard } from 'components';
import {
  CustomizableIntervals,
  FakeVSRealChart,
  FlangeMonitoringPointsCircleChart
} from 'features/feature-data';
import React from 'react';
import intl from 'react-intl-universal';

export const FlangeOverview = ({ asset }: { asset: AssetRow }) => {
  return (
    <EmptyMonitoringPoints asset={asset}>
      <Grid wrap={false} align='stretch'>
        <Col flex='auto'>
          <Grid>
            <Col span={24}>
              <MutedCard title={intl.get('BOLT_DIAGRAM')}>
                <FlangeMonitoringPointsCircleChart asset={asset} big={true} />
              </MutedCard>
            </Col>
            <Col span={24}>
              {isFlangePreloadCalculationEnabled(asset) ? (
                <FakeVSRealChart asset={asset} />
              ) : (
                <CustomizableIntervals
                  monitoringPoints={asset.monitoringPoints ?? []}
                  interactionDisabled={true}
                />
              )}
            </Col>
          </Grid>
        </Col>
        <Col flex='300px'>
          <Grid>
            <Col span={24}>
              <AlarmsObjectStatistics
                total={asset.statistics.monitoringPointNum}
                alarms={asset.statistics.alarmNum}
                title={intl.get('monitoring.points')}
                subtext={intl.get('total')}
              />
            </Col>
            <Col span={24}>
              <SensorsStatistics
                total={asset.statistics.deviceNum}
                offlines={asset.statistics.offlineDeviceNum}
              />
            </Col>
          </Grid>
        </Col>
      </Grid>
    </EmptyMonitoringPoints>
  );
};
