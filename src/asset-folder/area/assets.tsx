import { Col, Empty } from 'antd';
import { AlarmsObjectStatistics, AssetRow, SensorsStatistics, StatisticBar } from 'asset-common';
import { Card, Grid } from 'components';
import React from 'react';
import { generateColProps } from 'utils/grid';
import { OverviewCard } from './overviewCard';
import intl from 'react-intl-universal';
import { ENV } from 'utils';
import { OverviewCardLegacy } from './overviewCard-legacy';

export const AssetsArea = ({ asset }: { asset: AssetRow }) => {
  const renderAssetList = (content: React.ReactNode) => {
    return (asset.children?.length ?? 0) > 0 ? (
      content
    ) : (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  };

  if (ENV.legacyEnabled === 'true') {
    return (
      <Grid>
        <Col span={24}>
          <StatisticBar asset={asset} />
        </Col>
        <Col span={24}>
          {renderAssetList(
            <Grid>
              {asset.children?.map((a) => (
                <Col key={a.id} {...generateColProps({ lg: 12, xl: 12, xxl: 8 })}>
                  <OverviewCardLegacy asset={a} />
                </Col>
              ))}
            </Grid>
          )}
        </Col>
      </Grid>
    );
  }
  return (
    <Grid wrap={false} align='stretch'>
      <Col flex='auto'>
        <Card style={{ height: '100%' }}>
          <Grid>
            {asset.children?.map((a) => (
              <Col key={a.id} {...generateColProps({ lg: 12, xl: 12, xxl: 8 })}>
                <OverviewCard asset={a} />
              </Col>
            ))}
          </Grid>
        </Card>
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
  );
};
