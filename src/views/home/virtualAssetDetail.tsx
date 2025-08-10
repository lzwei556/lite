import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Card, Descriptions, Link, TabsDetail, Grid, Chart, MutedCard } from '../../components';
import { generateColProps } from '../../utils/grid';
import { App, useAppType } from '../../config';
import { ColorHealth, ColorOffline } from '../../constants/color';
import { useLocaleContext } from '../../localeProvider';
import {
  Asset,
  ASSET_PATHNAME,
  getVirturalAsset,
  MONITORING_POINT,
  ProjectStatistics,
  useContext
} from '../../asset-common';
import { wind } from '../../features/asset-wind-turbine/constants';
import { area } from '../../asset-variant';
import { AlarmTrend } from './alarmTrend';
import { Icon } from './icon';
import { usePieOptions, useProjectStatistics } from './useProjectStatistics';
import { Settings } from './settings';

export default function VirtualAssetDetail() {
  const { assets } = useContext();
  const appType = useAppType();
  const projectStatistics = useProjectStatistics();
  const { language } = useLocaleContext();

  const useAssetPieOptions = (statics: ProjectStatistics, type: 'asset' | 'monitoring_point') => {
    let total = 0;
    let alarms: [number, number, number] = [0, 0, 0];
    if (type === 'asset') {
      total = statics.rootAssetNum;
      alarms = statics.rootAssetAlarmNum;
    } else if (type === 'monitoring_point') {
      total = statics.monitoringPointNum;
      alarms = statics.monitoringPointAlarmNum;
    }
    return usePieOptions(
      total,
      Asset.Statistics.resolveStatus(total, alarms).map((s) => ({
        ...s,
        name: intl.get(s.name),
        itemStyle: { color: s.color }
      })),
      language,
      intl.get('total')
    );
  };

  const useSensorPieOptions = (statics: ProjectStatistics) => {
    const total = statics.deviceNum;
    const offline = statics.deviceOfflineNum;
    return usePieOptions(
      total,
      [
        {
          name: intl.get('ONLINE'),
          value: total - offline,
          itemStyle: { color: ColorHealth }
        },
        {
          name: intl.get('OFFLINE'),
          value: offline,
          itemStyle: { color: ColorOffline }
        }
      ],
      language,
      intl.get('total')
    );
  };

  const AssetStatics = ({ statics }: { statics: ProjectStatistics }) => {
    return <Chart options={useAssetPieOptions(statics, 'asset')} style={{ height: 280 }} />;
  };

  const MonitoringPointStatics = ({ statics }: { statics: ProjectStatistics }) => {
    return (
      <Chart options={useAssetPieOptions(statics, 'monitoring_point')} style={{ height: 280 }} />
    );
  };

  const SensorStatics = ({ statics }: { statics: ProjectStatistics }) => {
    return <Chart options={useSensorPieOptions(statics)} style={{ height: 280 }} />;
  };

  const EmptyStatics = () => <Chart options={undefined} style={{ height: 280 }} />;

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
                    <MutedCard
                      title={intl.get(App.isWindLike(appType) ? wind.label : area.label)}
                      titleCenter={true}
                    >
                      {projectStatistics ? (
                        <AssetStatics statics={projectStatistics} />
                      ) : (
                        <EmptyStatics />
                      )}
                    </MutedCard>
                  </Col>
                  <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
                    <MutedCard title={intl.get(MONITORING_POINT)} titleCenter={true}>
                      {projectStatistics ? (
                        <MonitoringPointStatics statics={projectStatistics} />
                      ) : (
                        <EmptyStatics />
                      )}
                    </MutedCard>
                  </Col>
                  <Col {...generateColProps({ lg: 8, xl: 8, xxl: 5 })}>
                    <MutedCard title={intl.get('SENSOR')} titleCenter={true}>
                      {projectStatistics ? (
                        <SensorStatics statics={projectStatistics} />
                      ) : (
                        <EmptyStatics />
                      )}
                    </MutedCard>
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
