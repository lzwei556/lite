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
} from '../../asset-common';
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

  columns.push(
    ...[
      positionColumn,
      ...[
        {
          title: intl.get(AXIS_ALIAS.Axial.label),
          key: AXIS_ALIAS.Axial.key,
          render: (name: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.axial);
            return axis ? intl.get(axis.label) : '-';
          }
        },
        {
          title: intl.get(AXIS_ALIAS.Vertical.label),
          key: AXIS_ALIAS.Vertical.key,
          render: (name: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.vertical);
            return axis ? intl.get(axis.label) : '-';
          }
        },
        {
          title: intl.get(AXIS_ALIAS.Horizontal.label),
          key: AXIS_ALIAS.Horizontal.key,
          render: (name: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.horizontal);
            return axis ? intl.get(axis.label) : '-';
          }
        }
      ]
    ]
  );

  if (hasPermission(Permission.MeasurementAdd)) {
    columns.push(getOperateColumn({ onDeleteSuccess: onSuccess, onUpdate }));
  }

  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      cardProps={{ styles: { body: { padding: 0 } } }}
      dataSource={Points.sort(actualPoints)}
      header={{ toolbar: [<ActionBar {...props} />] }}
      pagination={false}
    />
  );
};
