import { Col } from 'antd';
import { AssetRow, EmptyMonitoringPoints, StatisticBar } from 'asset-common';
import { Grid, MutedCard } from 'components';
import { PrimaryAsset } from 'domain/asset';
import {
  CustomizableIntervals,
  FakeVSRealChart,
  FlangeMonitoringPointsCircleChart
} from 'features/feature-data';
import React from 'react';
import intl from 'react-intl-universal';
import { generateColProps } from 'utils/grid';

export const FlangeOverviewLegacy = ({ asset }: { asset: AssetRow }) => {
  return (
    <EmptyMonitoringPoints asset={asset}>
      <Grid>
        <Col span={24}>
          <StatisticBar asset={asset} />
        </Col>
        <Col span={24}>
          <Grid>
            <Col {...generateColProps({ xl: 12, xxl: 9 })}>
              <MutedCard title={intl.get('BOLT_DIAGRAM')}>
                <FlangeMonitoringPointsCircleChart asset={asset} big={true} />
              </MutedCard>
            </Col>
            <Col {...generateColProps({ xl: 12, xxl: 15 })}>
              {PrimaryAsset.Category.Flange.isPreloadCalculationEnabled(asset) ? (
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
      </Grid>
    </EmptyMonitoringPoints>
  );
};
