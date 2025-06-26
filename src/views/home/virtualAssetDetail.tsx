import React from 'react';
import intl from 'react-intl-universal';
import { Card, Descriptions, Tabs, Link } from '../../components';
import { generateColProps } from '../../utils/grid';
import { App, useAppType } from '../../config';
import {
  Asset,
  ASSET_PATHNAME,
  getVirturalAsset,
  MONITORING_POINT,
  OverviewPage,
  ProjectStatistics,
  useContext
} from '../asset-common';
import { wind } from '../app-wind-turbine/constants';
import { area } from '../asset-variant';
import { AlarmTrend } from './alarmTrend';
import { Icon } from './icon';
import { generatePieOptions, useProjectStatistics } from './useProjectStatistics';
import { Settings } from './settings';
import { ColorHealth, ColorOffline } from '../../constants/color';
import { useLocaleContext } from '../../localeProvider';

export const VirtualAssetDetail = () => {
  const { assets } = useContext();
  const appType = useAppType();
  const projectStatistics = useProjectStatistics();
  const colProps = generateColProps({ lg: 8, xl: 8, xxl: 5 });
  const { language } = useLocaleContext();

  const getTotalTitle = (number: number) => {
    return intl.get('TOTAL_WITH_NUMBER', { number });
  };

  const getAssetPieOptions = (
    statics: ProjectStatistics | undefined,
    type: 'asset' | 'monitoring_point'
  ) => {
    if (!statics) return null;
    let total = 0;
    let alarms: [number, number, number] = [0, 0, 0];
    if (type === 'asset') {
      total = statics.rootAssetNum;
      alarms = statics.rootAssetAlarmNum;
    } else if (type === 'monitoring_point') {
      total = statics.monitoringPointNum;
      alarms = statics.monitoringPointAlarmNum;
    }
    return generatePieOptions(
      getTotalTitle(total),
      Asset.Statistics.resolveStatus(total, alarms).map((s) => ({
        ...s,
        name: intl.get(s.name),
        itemStyle: { color: s.color }
      })),
      language
    );
  };

  const getSensorPieOptions = (statics: ProjectStatistics | undefined) => {
    if (!statics) return null;
    const total = statics.deviceNum;
    const offline = statics.deviceOfflineNum;
    return generatePieOptions(
      getTotalTitle(total),
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
      language
    );
  };

  return (
    <Tabs
      items={[
        {
          label: intl.get('OVERVIEW'),
          key: 'overview',
          children: (
            <OverviewPage
              {...{
                charts: [
                  {
                    colProps,
                    options: getAssetPieOptions(projectStatistics, 'asset'),
                    title: intl.get(App.isWindLike(appType) ? wind.label : area.label)
                  },
                  {
                    colProps,
                    options: getAssetPieOptions(projectStatistics, 'monitoring_point'),
                    title: intl.get(MONITORING_POINT)
                  },
                  {
                    colProps,
                    options: getSensorPieOptions(projectStatistics),
                    title: intl.get('SENSOR')
                  },
                  {
                    colProps: generateColProps({ xl: 24, xxl: 9 }),
                    render: <AlarmTrend title={intl.get('ALARM_TREND')} />
                  }
                ],
                introductions: assets.map((item) => {
                  const statistics = Asset.Statistics.resolveDescendant(item.statistics);
                  return (
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
                          <Link to={`/${ASSET_PATHNAME}/${item.id}-${item.type}`}>{item.name}</Link>
                        }
                      />
                    </Card>
                  );
                })
              }}
            />
          )
        },
        {
          label: intl.get('SETTINGS'),
          key: 'settings',
          children: <Settings />
        }
      ]}
      noStyle={true}
      tabBarExtraContent={{ left: getVirturalAsset().root.name }}
      tabsRighted={true}
    />
  );
};
