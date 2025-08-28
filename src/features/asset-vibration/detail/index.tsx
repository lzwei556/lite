import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Grid, TabsDetail } from '../../../components';
import {
  AssetNavigator,
  AssetRow,
  MonitoringPointRow,
  MonitoringPointsTable
} from '../../../asset-common';
import { AssetModelProvider } from '../../../asset-model';
import { Index as Overview } from './overview';
import { Update } from './update';
import { PointsTable } from './pointsTable';

export const Index = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (m: MonitoringPointRow) => void;
}) => {
  const { asset, onSuccess } = props;

  return (
    <AssetModelProvider asset={asset} key={asset.id}>
      <TabsDetail
        items={[
          {
            key: 'overview',
            label: intl.get('OVERVIEW'),
            content: <Overview asset={asset} key={asset.id} onSuccess={onSuccess} />
          },
          {
            key: 'monitoringPointList',
            label: intl.get('MONITORING_POINT_LIST'),
            content: (
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
            content: (
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
        title={<AssetNavigator asset={asset} />}
      />
    </AssetModelProvider>
  );
};
