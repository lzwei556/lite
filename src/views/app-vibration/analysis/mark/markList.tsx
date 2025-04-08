import React from 'react';
import { List } from 'antd';
import { Card, ChartMark } from '../../../../components';
import { roundValue } from '../../../../utils/format';
import CenterSide from '../centerSide';
import { useMarkContext } from './context';

export const MarkList = () => {
  const { visibledMarks } = ChartMark.useContext();
  const { markType } = useMarkContext();
  const marks = visibledMarks.filter((mark) => mark.type === markType);

  const getLabel = (index: number) => {
    switch (markType) {
      case 'Peak':
        return 'Start Cursor';
      case 'Double':
        return index === 0 ? 'Start Cursor' : index === 1 ? 'End Cursor' : 'Difference';
      case 'Multiple':
      case 'Top10':
        return `Peak${index + 1}`;
      case 'Harmonic':
        return `${index + 1}Harmon`;
    }
  };

  const getDiff = () => {
    if (markType === 'Double' && marks.length === 2) {
      const [start, end] = marks;
      const [startX, startY] = start.data as [string, number];
      const [endX, endY] = end.data as [string, number];
      const diff = [roundValue(Number(endX) - Number(startX)), endY - startY];
      return [{ data: diff } as ChartMark.Mark];
    }
    return [];
  };

  if (markType === 'Sideband') {
    return <CenterSide.MarkList />;
  } else {
    return (
      <Card styles={{ body: { overflowY: 'auto', maxHeight: 350 } }}>
        <List
          dataSource={marks.concat(getDiff())}
          renderItem={(mark, i) => (
            <List.Item>
              <List.Item.Meta description={getLabel(i)} />
              <span style={{ width: 90 }}>X: {mark.data[0]}</span>
              <span style={{ width: 90 }}>Y: {roundValue(mark.data[1] as number)}</span>
            </List.Item>
          )}
        />
      </Card>
    );
  }
};
