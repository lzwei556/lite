import React from 'react';
import intl from 'react-intl-universal';
import { Table } from '../../../components';
import usePermission, { Permission } from '../../../permission/permission';
import { useLocaleContext } from '../../../localeProvider';
import {
  AssetRow,
  getMonitoringPointColumns,
  getOperateColumn,
  MonitoringPointRow,
  Points,
  positionColumn
} from '../../asset-common';
import { AXIS_OPTIONS } from '../point/others';
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
          title: intl.get('axis.axial'),
          key: 'axial',
          render: (name: string, row: MonitoringPointRow) => {
            let label: string | undefined;
            if (row.attributes?.axial !== undefined) {
              label = AXIS_OPTIONS.find((a) => a.key === row.attributes?.axial)?.label;
            }
            return label ? intl.get(label) : '-';
          }
        },
        {
          title: intl.get('axis.vertical'),
          key: 'radial',
          render: (name: string, row: MonitoringPointRow) => {
            let label: string | undefined;
            if (row.attributes?.horizontal !== undefined) {
              label = AXIS_OPTIONS.find((a) => a.key === row.attributes?.horizontal)?.label;
            }
            return label ? intl.get(label) : '-';
          }
        },
        {
          title: intl.get('axis.horizontal'),
          key: 'horizontal',
          render: (name: string, row: MonitoringPointRow) => {
            let label: string | undefined;
            if (row.attributes?.vertical !== undefined) {
              label = AXIS_OPTIONS.find((a) => a.key === row.attributes?.vertical)?.label;
            }
            return label ? intl.get(label) : '-';
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
