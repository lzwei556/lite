import React from 'react';
import intl from 'react-intl-universal';
import { Table } from '../../../components';
import usePermission, { Permission } from '../../../permission/permission';
import { useLocaleContext } from '../../../localeProvider';
import {
  AssetRow,
  AXIS_ALIAS,
  getMonitoringPointColumns,
  getOperateColumn,
  MONITORING_POINT,
  MonitoringPointRow,
  Point,
  Points,
  positionColumn
} from '../../../asset-common';
import { ActionBar } from '../actionBar';
import { getDefaultSelectedPoint, useAssetContext } from './context';

export const PointsTable = (props: {
  asset: AssetRow;
  onUpdate: (point: MonitoringPointRow) => void;
  onSuccess: () => void;
}) => {
  const { asset, onUpdate, onSuccess } = props;
  const { language } = useLocaleContext();
  const basicColumns = getMonitoringPointColumns({ language });
  const { monitoringPoints = [] } = asset;
  const { hasPermission } = usePermission();
  const actualPoints = Points.filter(monitoringPoints);
  const columns = basicColumns;
  const { selectedPoint, setSelectedPoint } = useAssetContext();

  columns.push(
    ...[
      positionColumn,
      ...[
        {
          title: intl.get(AXIS_ALIAS.Axial.label),
          key: AXIS_ALIAS.Axial.key,
          render: (_: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.axial);
            return axis ? intl.get(axis.label) : '-';
          }
        },
        {
          title: intl.get(AXIS_ALIAS.Vertical.label),
          key: AXIS_ALIAS.Vertical.key,
          render: (_: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.vertical);
            return axis ? intl.get(axis.label) : '-';
          }
        },
        {
          title: intl.get(AXIS_ALIAS.Horizontal.label),
          key: AXIS_ALIAS.Horizontal.key,
          render: (_: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.horizontal);
            return axis ? intl.get(axis.label) : '-';
          }
        }
      ]
    ]
  );

  if (hasPermission(Permission.MeasurementAdd)) {
    columns.push(
      getOperateColumn({
        onDeleteSuccess: (id: number) => {
          onSuccess();
          if (selectedPoint?.id === id) {
            const restPoints = (asset.monitoringPoints ?? []).filter((m) => m.id !== id);
            setSelectedPoint(
              restPoints.length > 0
                ? getDefaultSelectedPoint({ ...asset, monitoringPoints: restPoints })
                : undefined
            );
          }
        },
        onUpdate
      })
    );
  }

  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns.map((c) => ({ ...c, width: 'auto' }))}
      cardProps={{
        extra: <ActionBar {...props} />,
        size: 'small',
        title: intl.get(MONITORING_POINT)
      }}
      dataSource={Points.sort(actualPoints)}
      pagination={false}
    />
  );
};
