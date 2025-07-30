import React from 'react';
import intl from 'react-intl-universal';
import { Table } from '../../../components';
import usePermission, { Permission } from '../../../permission/permission';
import { useLocaleContext } from '../../../localeProvider';
import {
  AssetRow,
  getMonitoringPointColumns,
  getOperateColumn,
  MONITORING_POINT,
  MonitoringPointRow,
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
  const columns = [...basicColumns, positionColumn];

  const initialCol = {
    title: () => intl.get('INITIAL_THICKNESS'),
    dataIndex: ['attributes', 'initial_thickness'],
    key: 'initial_thickness',
    render: (value: number) => value,
    width: 120
  };

  const criticalCol = {
    title: () => intl.get('CRITICAL_THICKNESS'),
    dataIndex: ['attributes', 'critical_thickness'],
    key: 'critical_thickness',
    render: (value: number) => value,
    width: 120
  };

  const shortTermCol = {
    title: () => intl.get('CORROSION_RATE_SHORT_TERM'),
    dataIndex: ['attributes', 'corrosion_rate_short_term'],
    key: 'corrosion_rate_short_term',
    width: 120
  };

  const longTermCol = {
    title: () => intl.get('CORROSION_RATE_LONG_TERM'),
    dataIndex: ['attributes', 'corrosion_rate_long_term'],
    key: 'corrosion_rate_long_term',
    width: 120
  };

  columns.push(initialCol);
  columns.push(criticalCol);
  columns.push(shortTermCol);
  columns.push(longTermCol);

  if (hasPermission(Permission.MeasurementAdd)) {
    columns.push(getOperateColumn({ onDeleteSuccess: () => onSuccess(), onUpdate }));
  }

  return (
    <Table
      cardProps={{
        extra: <ActionBar {...props} />,
        size: 'small',
        title: intl.get(MONITORING_POINT)
      }}
      columns={columns}
      dataSource={Points.sort(actualPoints)}
      rowKey={(record) => record.id}
    />
  );
};
