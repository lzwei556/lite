import React from 'react';
import intl from 'react-intl-universal';
import { Table } from '../../components';
import usePermission, { Permission } from '../../permission/permission';
import { useLocaleContext } from '../../localeProvider';
import {
  AssetRow,
  CorrosionRateLongTerm,
  CorrosionRateShortTerm,
  CriticalThickness,
  getMonitoringPointColumns,
  getOperateColumn,
  InitialThickness,
  MonitoringPointRow,
  Points,
  positionColumn
} from '../../asset-common';
import { getDisplayName, getValue } from '../../utils';
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

  const initialCol = {
    title: () =>
      getDisplayName({
        name: intl.get(InitialThickness.label),
        lang: language,
        suffix: InitialThickness.unit
      }),
    dataIndex: ['attributes', InitialThickness.name],
    key: InitialThickness.name,
    render: (value: number) => getValue({ value })
  };

  const criticalCol = {
    title: () =>
      getDisplayName({
        name: intl.get(CriticalThickness.label),
        lang: language,
        suffix: CriticalThickness.unit
      }),
    dataIndex: ['attributes', CriticalThickness.name],
    key: CriticalThickness.name,
    render: (value: number) => getValue({ value })
  };

  const shortTermCol = {
    title: () =>
      getDisplayName({
        name: intl.get(CorrosionRateShortTerm.label),
        lang: language,
        suffix: intl.get(CorrosionRateShortTerm.unit!)
      }),
    dataIndex: ['attributes', CorrosionRateShortTerm.name],
    key: CorrosionRateShortTerm.name,
    render: (value: number) => getValue({ value })
  };

  const longTermCol = {
    title: () =>
      getDisplayName({
        name: intl.get(CorrosionRateLongTerm.label),
        lang: language,
        suffix: intl.get(CorrosionRateLongTerm.unit!)
      }),
    dataIndex: ['attributes', CorrosionRateLongTerm.name],
    key: CorrosionRateLongTerm.name,
    render: (value: number) => getValue({ value })
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
        title: intl.get('monitoring.points')
      }}
      columns={columns}
      dataSource={Points.sort(actualPoints)}
      rowKey={(record) => record.id}
    />
  );
};
