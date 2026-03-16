import React from 'react';
import { Col } from 'antd';
import { Translation } from 'locales/utils';
import { Card, Descriptions, Link, TabsDetail, Grid } from '../../components';
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

export default function VirtualAssetDetailLegacy() {
  const { assets } = useContext();
  const appType = useAppType();
  const projectStatistics = useProjectStatistics();
  const { root } = useVirturalAsset();

  const getTitle = () => {
    let title = 'assets';
    if (App.isWindLike(appType)) {
      title = 'asset.wind-turbines';
    } else if (appType !== 'general') {
      title = 'asset.areas';
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
            <Grid>
              <Col span={24}>
                <Grid>
                  <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
                    <AlarmsObjectStatistics
                      chartHeight={280}
                      total={projectStatistics?.rootAssetNum}
                      alarms={projectStatistics?.rootAssetAlarmNum}
                      title={Translation.get(getTitle())}
                      subtext={Translation.get('common.total')}
                    />
                  </Col>
                  <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
                    <AlarmsObjectStatistics
                      chartHeight={280}
                      total={projectStatistics?.monitoringPointNum}
                      alarms={projectStatistics?.monitoringPointAlarmNum}
                      title={Translation.get('monitoring.points')}
                      subtext={Translation.get('common.total')}
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
                    <AlarmTrend
                      chartStyle={{ height: 280 }}
                      title={Translation.get('alarm.trend')}
                    />
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
                                  label:
                                    name.indexOf('offline') > -1
                                      ? Translation.between('device.status.offline', 'devices')
                                      : Translation.get(name),
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
          label: Translation.get('common.settings'),
          key: 'settings',
          content: <Settings />
        }
      ]}
      title={root.name}
    />
  );
}
