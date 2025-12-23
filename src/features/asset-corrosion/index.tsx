import React from 'react';
import { Col, Spin } from 'antd';
import intl from 'react-intl-universal';
import { Grid, TabsDetail, TabsDetailsItems } from '../../components';
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
import { Overview } from './overview';
import { AssetModelProvider } from '../../asset-model';
import { AssetAnnotationImage } from '../imageAnnotation';
import { Permission, useCan } from '../../providers/access-control';
import { ENV } from '../../utils';

export const Index = ({ loading, asset, refresh }: ContextProps & { asset: AssetRow }) => {
  const { id } = asset;
  const [open, setOpen] = React.useState(false);
  const [mointoringPoint, setMonitoringPoint] = React.useState<MonitoringPointRow | undefined>();
  const canEditMonitoringPoint = useCan(Permission.MeasurementEdit);
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

  const getItems = () => {
    const items: TabsDetailsItems = [];
    const isLegacy = ENV.legacyEnabled === 'true';
    if (!isLegacy) {
      items.push({
        key: 'overview',
        label: intl.get('OVERVIEW'),
        content: <Overview asset={asset} onSuccess={refresh} key={asset.id} />
      });
    }
    items.push(
      ...[
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
                <PointsTable {...props} key={id} />
              </Col>
              {!isLegacy && (
                <Col span={24}>
                  <AssetAnnotationImage
                    asset={asset}
                    key={`${asset.id}_${asset.monitoringPoints?.length}_${asset.image}`}
                    editable={canEditMonitoringPoint}
                    title={intl.get('OVERVIEW')}
                    onSuccess={refresh}
                  />
                </Col>
              )}
            </Grid>
          )
        }
      ]
    );
    return items;
  };

  return (
    <Spin spinning={loading}>
      <AssetModelProvider asset={asset}>
        <TabsDetail items={getItems()} title={<AssetNavigator asset={asset} />} />
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
