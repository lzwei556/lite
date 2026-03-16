import React from 'react';
import { Translation } from 'locales/utils';
import { Table } from '../../components';
import {
  AssetRow,
  getMonitoringPointColumns,
  getOperateColumn,
  MonitoringPointRow,
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
  const columns = [...basicColumns, positionColumn];
  const canAddMonitoringPoint = useCan(Permission.MeasurementAdd);
  if (useCan(Permission.MeasurementAdd)) {
    columns.push(getOperateColumn({ onDeleteSuccess: () => onSuccess(), onUpdate }));
  }

  return (
    <Table
      cardProps={{
        extra: canAddMonitoringPoint && <ActionBar {...props} />,
        title: Translation.get('monitoring.points')
      }}
      columns={columns}
      dataSource={Points.sort(actualPoints)}
      rowKey={(record) => record.id}
    />
  );
};
