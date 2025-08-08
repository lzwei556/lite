import React from 'react';
import { Col, Spin } from 'antd';
import intl from 'react-intl-universal';
import { Grid, TabsDetail } from '../../components';
import {
  AssetNavigator,
  AssetRow,
  ContextProps,
  MonitoringPointRow,
  MonitoringPointsTable
} from '../../asset-common';
import * as Point from '../monitoring-point-corrosion';
import { Update } from './update';
import { PointsTable } from './pointsTable';

export const Index = ({ loading, asset, refresh }: ContextProps & { asset: AssetRow }) => {
  const { id } = asset;
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
      <TabsDetail
        items={[
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
                  <Update asset={asset} onSuccess={refresh} key={id} />
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
