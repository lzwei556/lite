import React from 'react';
import { Translation } from 'locales/utils';
import { Table } from '../../components';
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
import { ActionBar } from './actionBar';
import { Permission, useCan } from '../../providers/access-control';
import { useI18n } from 'providers/i18n';

export const PointsTable = (props: {
  asset: AssetRow;
  onUpdate: (point: MonitoringPointRow) => void;
  onSuccess: () => void;
}) => {
  const { asset, onUpdate, onSuccess } = props;
  const { language } = useI18n();
  const basicColumns = getMonitoringPointColumns({ language });
  const { monitoringPoints = [] } = asset;
  const actualPoints = Points.filter(monitoringPoints);
  const columns = basicColumns;
  const canAddMonitoringPoint = useCan(Permission.MeasurementAdd);

  columns.push(
    ...[
      positionColumn,
      ...[
        {
          title: Translation.get(AXIS_ALIAS.Axial.abbr),
          key: AXIS_ALIAS.Axial.key,
          render: (_: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.axial);
            return axis ? Translation.get(axis.label) : '-';
          }
        },
        {
          title: Translation.get(AXIS_ALIAS.Vertical.abbr),
          key: AXIS_ALIAS.Vertical.key,
          render: (_: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.vertical);
            return axis ? Translation.get(axis.label) : '-';
          }
        },
        {
          title: Translation.get(AXIS_ALIAS.Horizontal.abbr),
          key: AXIS_ALIAS.Horizontal.key,
          render: (_: string, row: MonitoringPointRow) => {
            let axis = Point.getAxis(row.attributes?.horizontal);
            return axis ? Translation.get(axis.label) : '-';
          }
        }
      ]
    ]
  );

  if (useCan(Permission.MeasurementAdd)) {
    columns.push(getOperateColumn({ onDeleteSuccess: () => onSuccess(), onUpdate }));
  }

  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns.map((c) => ({ ...c, width: 'auto' }))}
      cardProps={{
        extra: canAddMonitoringPoint && <ActionBar {...props} />,
        title: Translation.get('monitoring.points')
      }}
      dataSource={Points.sort(actualPoints)}
      pagination={false}
    />
  );
};
