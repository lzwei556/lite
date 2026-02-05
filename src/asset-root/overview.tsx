import React from 'react';
import { Col, Space } from 'antd';
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
import { Card, Descriptions, Grid, Link, MutedCard } from 'components';
import { generateColProps } from 'utils/grid';
import { Icon } from 'asset-folder/icons';

export const Overview = () => {
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
    <Grid wrap={false} align='stretch'>
      <Col flex='auto'>
        <Card style={{ height: '100%' }}>
          <Grid>
            {assets.map((item) => {
              const statistics = Asset.Statistics.resolveDescendant(item.statistics);
              return (
                <Col {...generateColProps({ lg: 12, xl: 8, xxl: 6 })} key={item.id}>
                  <MutedCard
                    title={
                      <Space size={24}>
                        <Icon asset={item} height={30} width={30} />
                        <Link to={`/${ASSET_PATHNAME}/${item.id}-${item.type}`}>{item.name}</Link>
                      </Space>
                    }
                  >
                    <Descriptions
                      contentStyle={{ transform: 'translate(-40px)' }}
                      items={statistics.map(({ name, value }) => ({
                        label: intl.get(name),
                        children: value
                      }))}
                    />
                  </MutedCard>
                </Col>
              );
            })}
          </Grid>
        </Card>
      </Col>
      <Col flex='300px'>
        <Grid>
          <Col span={24}>
            <AlarmsObjectStatistics
              total={projectStatistics?.rootAssetNum}
              alarms={projectStatistics?.rootAssetAlarmNum}
              title={intl.get(getTitle())}
              subtext={intl.get('total')}
            />
          </Col>
          <Col span={24}>
            <AlarmsObjectStatistics
              total={projectStatistics?.monitoringPointNum}
              alarms={projectStatistics?.monitoringPointAlarmNum}
              title={intl.get('monitoring.points')}
              subtext={intl.get('total')}
            />
          </Col>
          <Col span={24}>
            <SensorsStatistics
              total={projectStatistics?.deviceNum}
              offlines={projectStatistics?.deviceOfflineNum}
            />
          </Col>
          <Col span={24}>
            <AlarmTrend chartStyle={{ height: 210 }} title={intl.get('ALARM_TREND')} />
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
