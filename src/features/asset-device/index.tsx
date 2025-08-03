import React from 'react';
import { Col, Spin } from 'antd';
import intl from 'react-intl-universal';
import { Grid, Tabs } from '../../components';
import {
  AssetNavigator,
  AssetRow,
  ContextProps,
  MonitoringPointRow,
  MonitoringPointsTable,
  TabBarExtraLeftContent
} from '../../asset-common';
import * as Point from '../monitoring-point-device';
import { Update } from './update';
import { PointsTable } from './pointsTable';

export const Index = ({ loading, asset, refresh }: ContextProps & { asset: AssetRow }) => {
  const { id, type, alertLevel } = asset;
  const [open, setOpen] = React.useState(false);
  const [mointoringPoint, setMonitoringPoint] = React.useState<MonitoringPointRow | undefined>();
  const props = {
    asset,
    onSuccess: refresh,
    onUpdate: (m: MonitoringPointRow) => {
      setOpen(true);
      setMonitoringPoint(m);
    }
  };

  const reset = () => {
    setOpen(false);
    setMonitoringPoint(undefined);
  };

  return (
    <Spin spinning={loading}>
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
                  <Update asset={asset} onSuccess={refresh} key={id} />
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
              <AssetNavigator id={id} type={type} />
            </TabBarExtraLeftContent>
          )
        }}
        tabsRighted={true}
      />
      {mointoringPoint && (
        <Point.UpdateModal
          key={mointoringPoint.id}
          monitoringPoint={mointoringPoint}
          open={open}
          onCancel={reset}
          onSuccess={() => {
            refresh();
            reset();
          }}
        />
      )}
    </Spin>
  );
};
