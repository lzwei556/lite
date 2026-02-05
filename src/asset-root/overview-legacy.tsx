import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import {
  AlarmsObjectStatistics,
  AlarmTrend,
  Asset,
  ASSET_PATHNAME,
  SensorsStatistics,
  useContext
} from 'asset-common';
import { App, useAppType } from 'config/context';
import { useProjectStatistics } from './hooks';
import { Card, Descriptions, Grid, Link } from 'components';
import { generateColProps } from 'utils/grid';
import { Icon } from 'asset-folder/icons';

export const OverviewLegacy = () => {
  const { assets } = useContext();
  const appType = useAppType();
  const projectStatistics = useProjectStatistics();

  const getTitle = () => {
    let title = 'assets';
    if (App.isWindLike(appType)) {
      title = 'wind.turbines';
    } else if (appType !== 'general') {
      title = 'areas';
    }
    return title;
  };

  return (
    <Grid>
      <Col span={24}>
        <Grid>
          <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
            <AlarmsObjectStatistics
              chartHeight={280}
              total={projectStatistics?.rootAssetNum}
              alarms={projectStatistics?.rootAssetAlarmNum}
              title={intl.get(getTitle())}
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
                      <Link to={`/${ASSET_PATHNAME}/${item.id}-${item.type}`}>{item.name}</Link>
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
