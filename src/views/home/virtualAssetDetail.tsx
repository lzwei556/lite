import React from 'react';
import intl from 'react-intl-universal';
import { Card, Descriptions, Tabs } from '../../components';
import { generateColProps } from '../../utils/grid';
import { App, useAppType } from '../../config';
import { Asset, ASSET_PATHNAME, getVirturalAsset, OverviewPage, useContext } from '../asset-common';
import { wind } from '../app-wind-turbine/constants';
import { area } from '../asset-variant';
import { AlarmTrend } from './alarmTrend';
import { Icon } from './icon';
import { useProjectStatistics } from './useProjectStatistics';
import { Settings } from './settings';
import { SelfLink } from '../../components/selfLink';

export const VirtualAssetDetail = () => {
  const { assets } = useContext();
  const appType = useAppType();

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
                  ...useProjectStatistics(App.isWindLike(appType) ? wind.label : area.label),
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
                          <SelfLink to={`/${ASSET_PATHNAME}/${item.id}-${item.type}`}>
                            {item.name}
                          </SelfLink>
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
