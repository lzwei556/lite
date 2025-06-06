import React from 'react';
import { List } from 'antd';
import { Card, ChartMark } from '../../../../components';
import { Language, useLocaleContext } from '../../../../localeProvider';
import { formatNumericData } from '../../../../utils/format';
import CenterSide from '../centerSide';
import { useMarkContext } from './context';

export const MarkList = () => {
  const { language } = useLocaleContext();
  const { visibledMarks } = ChartMark.useContext();
  const { markType } = useMarkContext();
  const marks = visibledMarks.filter((mark) => mark.type === markType);

  const getLabel = (index: number) => {
    switch (markType) {
      case 'Peak':
        return language === 'zh-CN' ? '峰值' : 'Peak';
      case 'Double':
        const start = language === 'zh-CN' ? '起始游标' : 'Start Cursor';
        const end = language === 'zh-CN' ? '终止游标' : 'End Cursor';
        const diff = language === 'zh-CN' ? '差值' : 'Difference';
        return index === 0 ? start : index === 1 ? end : diff;
      case 'Multiple':
      case 'Top10':
        return `${language === 'zh-CN' ? '峰值' : 'Peak'}${index + 1}`;
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
    return <CenterSide.MarkList />;
  } else {
    return (
      <Card styles={{ body: { overflowY: 'auto', maxHeight: 350 } }}>
        <List
          dataSource={marks.concat(getDiff()).map(transformMarkData)}
          renderItem={(mark, i) => {
            const diffSymbol = mark.type === 'diff' ? '△' : '';
            const [x, y] = mark.data;

            return (
              <List.Item>
                <List.Item.Meta description={getLabel(i)} />
                <span style={{ width: 90 }}>
                  X: {diffSymbol}
                  {dispalyCoordValue(x, language)}
                </span>
                <span style={{ width: 90 }}>
                  Y:{diffSymbol}
                  {dispalyCoordValue(y, language)}
                </span>
              </List.Item>
            );
          }}
        />
      </Card>
    );
  }
};

export function dispalyCoordValue(value: any, language: Language) {
  if (value === 'out.of.range') {
    return language === 'zh-CN' ? '超出范围' : 'Out Of Range';
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
