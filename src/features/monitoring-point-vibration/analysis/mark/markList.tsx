import React from 'react';
import intl from 'react-intl-universal';
import { ChartMark, Table } from '../../../../components';
import { formatNumericData } from '../../../../utils/format';
import Sideband from '../sideband';
import { useMarkChartProps } from './hooks';

export const MarkList = () => {
  const { marks, markType } = useMarkChartProps();

  const getLabel = (index: number) => {
    switch (markType) {
      case 'Peak':
        return intl.get('cursor.peak');
      case 'Double':
        const start = intl.get('cursor.double.start');
        const end = intl.get('cursor.double.end');
        const diff = intl.get('cursor.double.diff');
        return index === 0 ? start : index === 1 ? end : diff;
      case 'Multiple':
      case 'Top10':
        return `${intl.get('cursor.peak')}${index + 1}`;
      case 'Harmonic':
        return `${index + 1}x`;
    }
  };

  const getDiff = () => {
    if (markType === 'Double' && marks.length === 2) {
      const [start, end] = marks;
      const [startX, startY] = start.data as [string, number];
      const [endX, endY] = end.data as [string, number];
      const diff = [Number(endX) - Number(startX), endY - startY];
      return [{ data: diff, type: 'diff' } as ChartMark.Mark];
    }
    return [];
  };

  if (markType === 'Sideband') {
    return <Sideband.MarkList />;
  } else {
    return (
      <Table
        cardProps={{ styles: { body: { padding: 0 } } }}
        columns={[
          { key: 'name', title: '', render: (_, __, index) => getLabel(index) },
          {
            key: 'x',
            title: 'X',
            render: (_, row: ChartMark.Mark) => {
              const diffSymbol = row.type === 'diff' ? '△' : '';
              return `${diffSymbol}${dispalyCoordValue(row.data?.[0])}`;
            }
          },
          {
            key: 'y',
            title: 'Y',
            render: (_, row: ChartMark.Mark) => {
              const diffSymbol = row.type === 'diff' ? '△' : '';
              return `${diffSymbol}${dispalyCoordValue(row.data?.[1])}`;
            }
          }
        ]}
        dataSource={marks.concat(getDiff()).map(transformMarkData)}
        noScroll={true}
        pagination={false}
        style={{ overflowY: 'auto', maxHeight: 350 }}
      />
    );
  }
};

export function dispalyCoordValue(value: any) {
  if (value === 'out.of.range') {
    return intl.get('out.of.range');
  }
  if (value === undefined || value === null) {
    return '-';
  } else {
    return value;
  }
}

export function transformMarkData(mark: ChartMark.Mark): ChartMark.Mark {
  let format = { ...mark };
  const { data } = format;
  if (Array.isArray(data) && data.length > 0) {
    if (Array.isArray(data[0])) {
      format = {
        ...mark,
        data: (data as [[string, number], [string, number]]).map((coord) =>
          coord.map(formatNumericData)
        )
      } as ChartMark.Mark;
    } else {
      format = {
        ...mark,
        data: (data as [string, number]).map((coord) => formatNumericData(coord))
      } as ChartMark.Mark;
    }
  }
  return format;
}
