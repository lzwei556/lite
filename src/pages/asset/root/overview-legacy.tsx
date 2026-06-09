import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { AlarmsObjectStatistics, AlarmTrend, Asset, SensorsStatistics } from 'asset-common';
import { useProjectStatistics } from './hooks';
import { Card, Descriptions, Grid, Link } from 'components';
import { generateColProps } from 'utils/grid';
import { Icon } from '../folder/icons';
import { useAssetsContext } from 'providers/assets';
import { useAppConfig } from 'providers/app';
import { AssetTree } from 'domains/asset';

export const OverviewLegacy = () => {
  const { assets } = useAssetsContext();
  const projectStatistics = useProjectStatistics();

  return (
    <Grid>
      <Col span={24}>
        <Grid>
          <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
            <AlarmsObjectStatistics
              chartHeight={280}
              total={projectStatistics?.rootAssetNum}
              alarms={projectStatistics?.rootAssetAlarmNum}
              title={intl.get(useAppConfig().rootAsset.labels)}
              subtext={intl.get('total')}
            />
          </Col>
          <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
            <AlarmsObjectStatistics
              chartHeight={280}
              total={projectStatistics?.monitoringPointNum}
              alarms={projectStatistics?.monitoringPointAlarmNum}
              title={intl.get('monitoring.points')}
              subtext={intl.get('total')}
            />
          </Col>
          <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
            <SensorsStatistics
              chartHeight={280}
              total={projectStatistics?.deviceNum}
              offlines={projectStatistics?.deviceOfflineNum}
            />
          </Col>
          <Col {...generateColProps({ xxl: 9 })}>
            <AlarmTrend chartStyle={{ height: 280 }} title={intl.get('ALARM_TREND')} />
          </Col>
        </Grid>
      </Col>
      <Col span={24}>
        <Grid>
          {assets.map((item) => {
            const statistics = Asset.Statistics.resolveDescendant(item.statistics);
            return (
              <Col {...generateColProps({ lg: 12, xl: 8, xxl: 6 })} key={item.id}>
                <Card styles={{ body: { padding: 24 } }}>
                  <Card.Meta
                    avatar={<Icon asset={item} height={30} width={30} />}
                    description={
                      <Descriptions
                        contentStyle={{ transform: 'translate(-40px)' }}
                        items={statistics.map(({ name, value }) => ({
                          label: intl.get(name),
                          children: value
                        }))}
                      />
                    }
                    title={
                      <Link to={`/${AssetTree.Path.Assets}/${item.id}-${item.type}`}>
                        {item.name}
                      </Link>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Grid>
      </Col>
    </Grid>
  );
};
