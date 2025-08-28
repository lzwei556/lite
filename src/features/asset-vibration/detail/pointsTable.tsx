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
  MonitoringPointRow,
  Point,
  Points,
  positionColumn
} from '../../../asset-common';
import { getSelected, transform2Selected, useAssetModelContext } from '../../../asset-model';
import { ActionBar } from '../actionBar';

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
  const { selectedMonitoringPoint, setSelectedMonitoringPoint } = useAssetModelContext();

  columns.push(
    ...[
      positionColumn,
      ...[
        {
          title: intl.get(AXIS_ALIAS.Axial.abbr),
          key: AXIS_ALIAS.Axial.key,
          render: (_: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.axial);
            return axis ? intl.get(axis.label) : '-';
          }
        },
        {
          title: intl.get(AXIS_ALIAS.Vertical.abbr),
          key: AXIS_ALIAS.Vertical.key,
          render: (_: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.vertical);
            return axis ? intl.get(axis.label) : '-';
          }
        },
        {
          title: intl.get(AXIS_ALIAS.Horizontal.abbr),
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
          if (selectedMonitoringPoint?.id === id) {
            const restPoints = (asset.monitoringPoints ?? []).filter((m) => m.id !== id);
            setSelectedMonitoringPoint(transform2Selected(getSelected(restPoints?.[0])));
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
        title: intl.get('monitoring.points')
      }}
      dataSource={Points.sort(actualPoints)}
      pagination={false}
    />
  );
};
