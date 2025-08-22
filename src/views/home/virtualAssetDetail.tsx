import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Card, Descriptions, Link, TabsDetail, Grid } from '../../components';
import { generateColProps } from '../../utils/grid';
import { App, useAppType } from '../../config';

import {
  Asset,
  ASSET_PATHNAME,
  getVirturalAsset,
  useContext,
  AlarmsObjectStatistics,
  SensorsStatistics,
  AlarmTrend
} from '../../asset-common';
import { Icon } from './icon';
import { useProjectStatistics } from './useProjectStatistics';
import { Settings } from './settings';

export default function VirtualAssetDetail() {
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
    <TabsDetail
      items={[
        {
          label: intl.get('OVERVIEW'),
          key: 'overview',
          content: (
            <Grid>
              <Col span={24}>
                <Grid>
                  <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
                    <AlarmsObjectStatistics
                      total={projectStatistics?.rootAssetNum}
                      alarms={projectStatistics?.rootAssetAlarmNum}
                      title={intl.get(getTitle())}
                      subtext={intl.get('total')}
                    />
                  </Col>
                  <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
                    <AlarmsObjectStatistics
                      total={projectStatistics?.monitoringPointNum}
                      alarms={projectStatistics?.monitoringPointAlarmNum}
                      title={intl.get('monitoring.points')}
                      subtext={intl.get('total')}
                    />
                  </Col>
                  <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
                    <SensorsStatistics
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
                      <Col {...generateColProps({ lg: 12, xl: 8, xxl: 6 })}>
                        <Card styles={{ body: { padding: 24 } }}>
                          <Card.Meta
                            avatar={<Icon node={item} />}
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
                              <Link to={`/${ASSET_PATHNAME}/${item.id}-${item.type}`}>
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
          )
        },
        {
          label: intl.get('SETTINGS'),
          key: 'settings',
          content: <Settings />
        }
      ]}
      title={getVirturalAsset().root.name}
    />
  );
}
