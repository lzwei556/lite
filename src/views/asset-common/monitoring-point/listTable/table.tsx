import React from 'react';
import { Tabs } from 'antd';
import intl from 'react-intl-universal';
import { uniq } from 'lodash';
import { Table, Link } from '../../../../components';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from '../../../../config';
import { ASSET_PATHNAME, AssetRow, MonitoringPointRow, Points } from '../..';
import { getColumns, OperateCellProps } from './columns';
import { useLocaleContext } from '../../../../localeProvider';

export type MonitoringPointsTableProps = {
  asset: AssetRow;
  enableSettingColumnsCount?: boolean;
  more?: boolean;
  operateCellProps?: OperateCellProps;
  showTitle?: boolean;
};

export const MonitoringPointsTable = ({
  asset,
  showTitle,
  enableSettingColumnsCount,
  ...rest
}: MonitoringPointsTableProps) => {
  const { id, name, monitoringPoints = [] } = asset;
  const actualPoints = Points.filter(monitoringPoints);
  const { language } = useLocaleContext();
  const title = showTitle ? (
    <Link
      to={`/${ASSET_PATHNAME}/${id}-${asset.type}`}
      state={[`${id}-${asset.type}`]}
      style={{ display: 'inline-block', fontSize: 16 }}
      onClick={(e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      }}
    >
      {name}
    </Link>
  ) : undefined;
  const [activeKey, setActiveKey] = React.useState(`${actualPoints?.[0]?.type}`);

  const tableProps = {
    ...rest,
    cardBordered: true,
    header: { title, enableSettingColumnsCount },
    rowKey: (point: MonitoringPointRow) => point.id
  };

  if (actualPoints.length > 0) {
    const columns = getColumns({
      language,
      point: actualPoints.filter((m) => m.type === Number(activeKey))[0],
      ...rest
    });
    const types = uniq(actualPoints.map((m) => m.type));
    if (types.length > 1) {
      return (
        <Tabs
          activeKey={`${activeKey}`}
          items={types.map((t) => ({
            key: `${t}`,
            label: intl.get(
              MonitoringPointTypeText[
                MonitoringPointTypeValue[t] as keyof typeof MonitoringPointTypeText
              ]
            ),
            children: (
              <Table
                {...{ ...tableProps, columns }}
                dataSource={actualPoints.filter((m) => m.type === t)}
                tableLayout='fixed'
              />
            )
          }))}
          onChange={setActiveKey}
        />
      );
    } else {
      return (
        <Table {...{ ...tableProps, columns }} dataSource={actualPoints} tableLayout='fixed' />
      );
    }
  } else {
    const columns = getColumns({ language, ...rest });
    return <Table {...{ ...tableProps, columns }} />;
  }
};
