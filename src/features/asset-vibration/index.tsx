import React from 'react';
import { Col, Spin } from 'antd';
import {
  AssetNavigator,
  AssetRow,
  ContextProps,
  MonitoringPointRow,
  MonitoringPointsTable
} from '../../asset-common';
import * as Point from '../monitoring-point-vibration';
import { AssetModelProvider } from '../../asset-model';
import { Grid, TabsDetail } from '../../components';
import intl from 'react-intl-universal';
import { Overview } from './overview';
import { Update } from './update';
import { PointsTable } from './pointsTable';
import { AssetAnnotationImage } from '../imageAnnotation';
import DianJi from './dianji.png';

export const Index = ({ loading, asset, refresh }: ContextProps & { asset: AssetRow }) => {
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
      <AssetModelProvider asset={asset}>
        <TabsDetail
          items={[
            {
              key: 'overview',
              label: intl.get('OVERVIEW'),
              content: <Overview asset={asset} key={asset.id} />
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
                    <Update asset={asset} onSuccess={refresh} key={asset.id} />
                  </Col>
                  <Col span={24}>
                    <PointsTable {...props} />
                  </Col>
                  <Col span={24}>
                    <AssetAnnotationImage
                      asset={asset}
                      backgroundImage={DianJi}
                      key={`${asset.id}_${asset.monitoringPoints?.length}_${asset.image}`}
                      editable={true}
                      title={intl.get('OVERVIEW')}
                    />
                  </Col>
                </Grid>
              )
            }
          ]}
          title={<AssetNavigator asset={asset} />}
        />
      </AssetModelProvider>
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
