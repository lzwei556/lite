import { Col, Empty } from 'antd';
import { AlarmsObjectStatistics, AssetRow, SensorsStatistics, StatisticBar } from 'asset-common';
import { Card, Grid } from 'components';
import React from 'react';
import { generateColProps } from 'utils/grid';
import { OverviewCard } from './overviewCard';
import intl from 'react-intl-universal';
import { ENV } from 'utils';

export const AssetsWindTurbine = ({ asset }: { asset: AssetRow }) => {
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
            asset.children
              ?.sort((prev, next) => {
                const { index: prevIndex } = prev.attributes || { index: 88 };
                const { index: nextIndex } = next.attributes || { index: 88 };
                return prevIndex - nextIndex;
              })
              ?.map((a) => (
                <Col key={a.id} {...generateColProps({ xl: 12, xxl: 8 })}>
                  <OverviewCard asset={a} />
                </Col>
              ))
          )}
        </Col>
      </Grid>
    );
  }
  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        {renderAssetList(
          <Grid>
            {asset.children
              ?.sort((prev, next) => {
                const { index: prevIndex } = prev.attributes || { index: 88 };
                const { index: nextIndex } = next.attributes || { index: 88 };
                return prevIndex - nextIndex;
              })
              ?.map((a) => (
                <Col key={a.id} {...generateColProps({ xl: 12, xxl: 12 })}>
                  <OverviewCard asset={a} />
                </Col>
              ))}
          </Grid>
        )}
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
