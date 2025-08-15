import React from 'react';
import intl from 'react-intl-universal';
import { dispalyCoordValue, transformMarkData, useMarkChartProps } from '../mark';
import { ChartMark, Table } from '../../../../components';

export const MarkList = () => {
  const { marks } = useMarkChartProps();

  return (
    <Table
      cardProps={{ styles: { body: { padding: 0 } } }}
      columns={[
        {
          key: 'name',
          title: '',
          render: (_, row: ChartMark.Mark) =>
            row.label ? (
              <span style={{ display: 'inline-block', minWidth: 65 }}>
                {intl.get(row.label as string)}
              </span>
            ) : (
              ''
            )
        },
        {
          key: 'x',
          title: 'X',
          render: (_, row: ChartMark.Mark) => dispalyCoordValue(row.data?.[0])
        },
        {
          key: 'y',
          title: 'Y',
          render: (_, row: ChartMark.Mark) => dispalyCoordValue(row.data?.[1])
        }
      ]}
      noScroll={true}
      pagination={false}
      dataSource={marks.map(transformMarkData)}
      style={{ overflowY: 'auto', maxHeight: 350 }}
    />
  );
};
