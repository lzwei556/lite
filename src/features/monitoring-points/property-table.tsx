import { RadioFormItem, Table } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { basicFieldColumns, usePropertyColumns } from './columns';
import { uniq } from 'lodash';
import { Points } from 'monitoring-point';
import { AssetRow } from 'asset-common';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';

export const PropertyTable = ({
  asset,
  enableSettingColumnsCount = true
}: {
  asset: AssetRow;
  enableSettingColumnsCount?: boolean;
}) => {
  const { monitoringPoints = [] } = asset;
  const actualPoints = Points.filter(monitoringPoints);

  const tableProps = {
    cardBordered: true,
    bordered: true,
    header: { enableSettingColumnsCount },
    rowKey: (point: TMonitoringPoint.Base) => point.id
  };

  if (actualPoints.length > 0) {
    const types = uniq(actualPoints.map((m) => m.type));
    return <TypedTable actualPoints={actualPoints as any} types={types} tableProps={tableProps} />;
  } else {
    return <Table {...{ ...tableProps, columns: basicFieldColumns }} />;
  }
};

const TypedTable = ({
  actualPoints,
  types,
  tableProps
}: {
  actualPoints: TMonitoringPoint.Base[];
  types: number[];
  tableProps: any;
}) => {
  const [selectedType, setSelectedType] = React.useState(actualPoints[0].type);
  const columns = [
    ...basicFieldColumns,
    ...usePropertyColumns(actualPoints.filter((m) => m.type === selectedType)[0])
  ];
  return (
    <Table
      {...{
        ...tableProps,
        columns,
        header: {
          ...tableProps.header,
          title: types.length > 1 && <TypeSwitcher onChange={setSelectedType} types={types} />
        }
      }}
      dataSource={actualPoints.filter((m) => m.type === selectedType)}
    />
  );
};

const TypeSwitcher = ({
  onChange,
  types
}: {
  onChange: (type: number) => void;
  types: number[];
}) => {
  return (
    <RadioFormItem
      noStyle
      radioGroupProps={{
        defaultValue: types[0],
        onChange: (e) => onChange(e.target.value),
        options: types.map((t) => ({
          value: t,
          label: intl.get(OMonitoringPoint.Type.getLabel(t))
        }))
      }}
    />
  );
};
