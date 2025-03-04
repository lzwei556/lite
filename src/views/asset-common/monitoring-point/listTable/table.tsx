import React from 'react';
import { Tabs } from 'antd';
import intl from 'react-intl-universal';
import { uniq } from 'lodash';
import { Table } from '../../../../components';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from '../../../../config';
import { SelfLink } from '../../../../components/selfLink';
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
    <SelfLink
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
    </SelfLink>
  ) : undefined;

  const columns = getColumns({ language, point: actualPoints[0], ...rest });

  const tableProps = {
    ...rest,
    cardBordered: true,
    columns,
    header: { title, enableSettingColumnsCount },
    rowKey: (point: MonitoringPointRow) => point.id
  };

  if (actualPoints.length > 0) {
    const types = uniq(actualPoints.map((m) => m.type));
    if (types.length > 1) {
      return (
        <Tabs
          items={types.map((t) => ({
            key: `${t}`,
            label: intl.get(
              MonitoringPointTypeText[
                MonitoringPointTypeValue[t] as keyof typeof MonitoringPointTypeText
              ]
            ),
            children: (
              <Table {...tableProps} dataSource={actualPoints.filter((m) => m.type === t)} />
            )
          }))}
        />
      );
    } else {
      return <Table {...tableProps} dataSource={actualPoints} />;
    }
  } else {
    return <Table {...tableProps} />;
  }
};
