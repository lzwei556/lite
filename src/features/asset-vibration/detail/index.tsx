import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Grid, Tabs } from '../../../components';
import {
  AssetNavigator,
  AssetRow,
  MonitoringPointRow,
  MonitoringPointsTable,
  TabBarExtraLeftContent
} from '../../../asset-common';
import { Index as Overview } from './overview';
import { Update } from './update';
import { PointsTable } from './pointsTable';
import { AssetProvider } from './context';

export const Index = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (m: MonitoringPointRow) => void;
}) => {
  const { asset, onSuccess } = props;
  const { id, alertLevel } = asset;

  return (
    <AssetProvider asset={asset}>
      <Tabs
        items={[
          {
            key: 'overview',
            label: intl.get('OVERVIEW'),
            children: <Overview asset={asset} key={asset.id} onSuccess={onSuccess} />
          },
          {
            key: 'monitoringPointList',
            label: intl.get('MONITORING_POINT_LIST'),
            children: (
              <MonitoringPointsTable
                key={`${asset.monitoringPoints?.map(({ id }) => id).join()}`}
                asset={asset}
                enableSettingColumnsCount={true}
              />
            )
          },
          {
            key: 'settings',
            label: intl.get('SETTINGS'),
            children: (
              <Grid>
                <Col span={24}>
                  <Update asset={asset} onSuccess={onSuccess} key={asset.id} />
                </Col>
                <Col span={24}>
                  <PointsTable {...props} />
                </Col>
              </Grid>
            )
          }
        ]}
        noStyle={true}
        tabBarExtraContent={{
          left: (
            <TabBarExtraLeftContent alertLevel={alertLevel}>
              <AssetNavigator id={id} type={asset.type} />
            </TabBarExtraLeftContent>
          )
        }}
        tabsRighted={true}
      />
    </AssetProvider>
  );
};
