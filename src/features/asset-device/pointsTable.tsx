import React from 'react';
import intl from 'react-intl-universal';
import { Table } from '../../components';
import usePermission, { Permission } from '../../permission/permission';
import { useLocaleContext } from '../../localeProvider';
import {
  AssetRow,
  getMonitoringPointColumns,
  getOperateColumn,
  MONITORING_POINT,
  MonitoringPointRow,
  Points,
  positionColumn
} from '../../asset-common';
import { ActionBar } from './actionBar';

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

  if (hasPermission(Permission.MeasurementAdd)) {
    columns.push(getOperateColumn({ onDeleteSuccess: () => onSuccess(), onUpdate }));
  }

  return (
    <Table
      cardProps={{
        extra: <ActionBar {...props} />,
        title: intl.get(MONITORING_POINT)
      }}
      columns={columns}
      dataSource={Points.sort(actualPoints)}
      rowKey={(record) => record.id}
    />
  );
};
