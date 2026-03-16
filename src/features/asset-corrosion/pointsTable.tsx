import React from 'react';
import { Translation } from 'locales/utils';
import { Table } from '../../components';
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
import { getValue } from '../../utils';
import { ActionBar } from './actionBar';
import { Permission, useCan } from '../../providers/access-control';
import { toPascal } from 'ts-case-convert';
import { useI18n } from 'providers/i18n';
import { getDisplayName } from 'locales/utils';

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

  const initialCol = {
    title: () =>
      getDisplayName({
        name: Translation.get(InitialThickness.label),
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
        name: Translation.get(CriticalThickness.label),
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
        name: Translation.get(CorrosionRateShortTerm.label),
        lang: language,
        suffix: toPascal(Translation.get(CorrosionRateShortTerm.unit!))
      }),
    dataIndex: ['attributes', CorrosionRateShortTerm.name],
    key: CorrosionRateShortTerm.name,
    render: (value: number) => getValue({ value })
  };

  const longTermCol = {
    title: () =>
      getDisplayName({
        name: Translation.get(CorrosionRateLongTerm.label),
        lang: language,
        suffix: toPascal(Translation.get(CorrosionRateLongTerm.unit!))
      }),
    dataIndex: ['attributes', CorrosionRateLongTerm.name],
    key: CorrosionRateLongTerm.name,
    render: (value: number) => getValue({ value })
  };

  columns.push(initialCol);
  columns.push(criticalCol);
  columns.push(shortTermCol);
  columns.push(longTermCol);

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
