import React from 'react';
import { CardChart } from '../../../components';
import { AnalysisCommonProps } from './analysisContent';

export const OrbitPlot = (props: AnalysisCommonProps) => {
  const data: [number, number][] = [];
  const centerX = 0; // 圆心X坐标
  const centerY = 0; // 圆心Y坐标
  const radius = 10; // 半径
  for (let theta = 0; theta <= 2 * Math.PI; theta += 0.1) {
    data.push([centerX + radius * Math.cos(theta), centerY + radius * Math.sin(theta)]);
  }
  // 确保闭合：最后一个点与第一个点重合
  data.push(data[0]);

  return (
    <CardChart
      cardProps={{
        style: { border: 'solid 1px #d3d3d3' }
      }}
      // loading={loading}
      options={{
        series: [{ type: 'line', data, showSymbol: false }],
        xAxis: { type: 'value' },
        yAxis: { type: 'value' }
      }}
      style={{ height: 450 }}
    />
  );
};
