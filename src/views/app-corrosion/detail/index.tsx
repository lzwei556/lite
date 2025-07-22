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
} from '../../asset-common';
import { Update } from './update';
import { PointsTable } from './pointsTable';

export const Index = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (m: MonitoringPointRow) => void;
}) => {
  const { asset, onSuccess } = props;
  const { alertLevel, id } = asset;

  return (
    <Tabs
      items={[
        {
          key: 'monitoringPointList',
          label: intl.get('MONITORING_POINT_LIST'),
          children: <MonitoringPointsTable asset={asset} enableSettingColumnsCount={true} />
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
  );
};
