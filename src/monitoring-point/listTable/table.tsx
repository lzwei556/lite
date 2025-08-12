import React from 'react';
import { Radio } from 'antd';
import intl from 'react-intl-universal';
import { uniq } from 'lodash';
import { Table } from '../../components';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from '../../config';
import { useLocaleContext } from '../../localeProvider';
import { AssetRow, MonitoringPointRow, Points } from '../../asset-common';
import { getColumns, OperateCellProps } from './columns';

export type MonitoringPointsTableProps = {
  asset: AssetRow;
  enableSettingColumnsCount?: boolean;
  more?: boolean;
  operateCellProps?: OperateCellProps;
};

export const MonitoringPointsTable = ({
  asset,
  enableSettingColumnsCount,
  ...rest
}: MonitoringPointsTableProps) => {
  const { monitoringPoints = [] } = asset;
  const actualPoints = Points.filter(monitoringPoints);
  const { language } = useLocaleContext();

  const tableProps = {
    ...rest,
    cardBordered: true,
    bordered: true,
    header: { enableSettingColumnsCount },
    rowKey: (point: MonitoringPointRow) => point.id
  };

  if (actualPoints.length > 0) {
    const types = uniq(actualPoints.map((m) => m.type));
    if (types.length > 1) {
      return <TypedTable actualPoints={actualPoints} types={types} tableProps={tableProps} />;
    } else {
      const columns = getColumns({ language, point: actualPoints[0], ...rest });
      return <Table {...{ ...tableProps, columns }} dataSource={actualPoints} />;
    }
  } else {
    const columns = getColumns({ language, ...rest });
    return <Table {...{ ...tableProps, columns }} />;
  }
};

const TypedTable = ({
  actualPoints,
  types,
  tableProps
}: {
  actualPoints: MonitoringPointRow[];
  types: number[];
  tableProps: any;
}) => {
  const { language } = useLocaleContext();
  const [selectedType, setSelectedType] = React.useState(actualPoints[0].type);
  const columns = getColumns({
    language,
    point: actualPoints.filter((m) => m.type === selectedType)[0],
    more: tableProps.more,
    operateCellProps: tableProps.operateCellProps
  });
  return (
    <Table
      {...{
        ...tableProps,
        columns,
        header: {
          ...tableProps.header,
          title: <TypeSwitcher onChange={setSelectedType} types={types} />
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
    <Radio.Group
      buttonStyle='solid'
      defaultValue={types[0]}
      onChange={(e) => onChange(e.target.value)}
      options={types.map((t) => ({
        value: t,
        label: intl.get(
          MonitoringPointTypeText[
            MonitoringPointTypeValue[t] as keyof typeof MonitoringPointTypeText
          ]
        )
      }))}
      optionType='button'
    />
  );
};
