import React from 'react';
import { WaveformData, WaveformUltrasound } from '../types';
import { Translation } from 'locales/utils';
import { getValue } from 'utils';
import { Card, LineChart } from 'components';
import { monitoringPointTypeWaveformMap, WaveformMonitoringPointKey } from './common';

export const Ultrasound = (props: { data: WaveformData; type: WaveformMonitoringPointKey }) => {
  return (
    <Card>
      <LineChart {...useChartProps(props)} />
    </Card>
  );
};

const useChartProps = ({
  data,
  type
}: {
  data: WaveformData;
  type: WaveformMonitoringPointKey;
}) => {
  const { properties, xAxis } = monitoringPointTypeWaveformMap[type];
  const property = properties[0];
  const { tof, mv } = data.values as WaveformUltrasound;
  const [paddingLefts, paddingRights] = padBothEnds(tof);

  return {
    config: {
      opts: {
        xAxis: { name: xAxis?.unit },
        yAxis: { name: property.unit },
        dataZoom: [{ start: 0, end: 100 }],
        grid: { top: 60, bottom: 60, right: 40 }
      }
    },
    series: [
      {
        data: {
          [Translation.get(property.name)]: [
            ...Array(paddingLefts.length).fill(0),
            ...mv,
            ...Array(paddingRights.length).fill(0)
          ]
        },
        xAxisValues: [...paddingLefts, ...tof, ...paddingRights].map((value) =>
          getValue({ value })
        ),
        raw: { smooth: true }
      }
    ],
    style: { height: 610 },
    yAxisMeta: property
  };
};

const padBothEnds = (tofs: number[]) => {
  const origin = 7;
  const target = 10;
  const right = (target - origin) / 3;
  const division = { left: 2 * right, origin, right };
  const length = {
    left: Math.floor((division.left * tofs.length) / division.origin),
    right: Math.floor((division.right * tofs.length) / division.origin)
  };
  const interval = ((Math.max(...tofs) - Math.min(...tofs)) / tofs.length) * (origin / target);
  const paddingLefts = Array(length.left)
    .fill(tofs[0])
    .map((n, i) => n - (i + 1) * interval)
    .reverse();
  const paddingRights = Array(length.right)
    .fill(tofs[tofs.length - 1])
    .map((n, i) => n + (i + 1) * interval);
  return [paddingLefts, paddingRights];
};
