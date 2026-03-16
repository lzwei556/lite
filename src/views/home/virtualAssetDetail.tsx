import React from 'react';
import { Col, Space } from 'antd';
import { Translation } from 'locales/utils';
import { Card, Descriptions, Link, TabsDetail, Grid, MutedCard } from '../../components';
import { generateColProps } from '../../utils/grid';
import { App, useAppType } from '../../config';

import {
  Asset,
  ASSET_PATHNAME,
  useContext,
  AlarmsObjectStatistics,
  SensorsStatistics,
  AlarmTrend,
  useVirturalAsset
} from '../../asset-common';
import { Icon } from './icon';
import { useProjectStatistics } from './useProjectStatistics';
import { Settings } from './settings';

export default function VirtualAssetDetail() {
  const { assets } = useContext();
  const appType = useAppType();
  const projectStatistics = useProjectStatistics();
  const { root } = useVirturalAsset();

  const getTitle = () => {
    let title = 'assets';
    if (App.isWindLike(appType)) {
      title = 'asset.wind-turbines';
    } else if (appType !== 'general') {
      title = 'areas';
    }
    return title;
  };

  return (
    <TabsDetail
      items={[
        {
          label: Translation.get('common.overview'),
          key: 'overview',
          content: (
            <Grid wrap={false} align='stretch'>
              <Col flex='auto'>
                <Card style={{ height: '100%' }}>
                  <Grid>
                    {assets.map((item) => {
                      const statistics = Asset.Statistics.resolveDescendant(item.statistics);
                      return (
                        <Col {...generateColProps({ lg: 12, xl: 8, xxl: 6 })}>
                          <MutedCard
                            title={
                              <Space size={24}>
                                <Icon node={item} />
                                <Link to={`/${ASSET_PATHNAME}/${item.id}-${item.type}`}>
                                  {item.name}
                                </Link>
                              </Space>
                            }
                          >
                            <Descriptions
                              contentStyle={{ transform: 'translate(-40px)' }}
                              items={statistics.map(({ name, value }) => ({
                                label:
                                  name.indexOf('offline') > -1
                                    ? Translation.between('device.status.offline', 'devices')
                                    : Translation.get(name),
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
                      title={Translation.get(getTitle())}
                      subtext={Translation.get('common.total')}
                    />
                  </Col>
                  <Col span={24}>
                    <AlarmsObjectStatistics
                      total={projectStatistics?.monitoringPointNum}
                      alarms={projectStatistics?.monitoringPointAlarmNum}
                      title={Translation.get('monitoring.points')}
                      subtext={Translation.get('common.total')}
                    />
                  </Col>
                  <Col span={24}>
                    <SensorsStatistics
                      total={projectStatistics?.deviceNum}
                      offlines={projectStatistics?.deviceOfflineNum}
                    />
                  </Col>
                  <Col span={24}>
                    <AlarmTrend
                      chartStyle={{ height: 210 }}
                      title={Translation.get('alarm.trend')}
                    />
                  </Col>
                </Grid>
              </Col>
            </Grid>
          )
        },
        {
          label: Translation.get('common.settings'),
          key: 'settings',
          content: <Settings />
        }
      ]}
      title={root.name}
    />
  );
}
