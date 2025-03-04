import { EChartsType, MarkLineOption, MarkPointOption } from 'echarts/types/dist/shared';
import { SeriesOption, ChartBrush } from '../charts';
import { LineMark, Mark, PointMark } from './types';

export function mergeMarkDatas(series: SeriesOption[], marks: Mark[]) {
  const { lines, points } = buildMarkDatas(marks);
  return series.map((s) => {
    const { markLine: prevLine, markPoint: prevPoint, ...rest } = s.raw || {};
    const lineData = prevLine?.data ?? [];
    const markLine = { ...prevLine, data: lineData.concat(lines) };
    const pointData = prevPoint?.data ?? [];
    const markPoint = { ...prevPoint, data: pointData.concat(points) };
    return { ...s, raw: { ...rest, markLine, markPoint, animation: false } };
  });
}

function buildMarkDatas(marks: Mark[]) {
  const lines: LineDataItem[] = [];
  const points: PointDataItem[] = [];
  marks.forEach((mark) => {
    if (isMarkLine(mark)) {
      lines.push(buildLineData(mark as LineMark));
    } else {
      points.push(buildPointData(mark as PointMark));
    }
  });
  return { lines, points };
}

export function isMarkLine(mark: Mark) {
  return Array.isArray(mark.data[0]) || typeof mark.data === 'string';
}

//point
type PointDataItem = NonNullable<MarkPointOption['data']>[0];

function buildPointData(mark: PointMark): PointDataItem {
  const { data: coord, name, label, value } = mark;
  return {
    label: {
      show: true,
      color: '#FF0000',
      position: 'top',
      formatter: `${label}\n${value ?? ''}`
    },
    symbol:
      'path://M392.448255 0h238.494873v635.98633h-238.494873zM495.00105 1016.783145L155.543347 677.325441A23.849487 23.849487 0 0 1 172.237988 635.98633h678.915407a23.849487 23.849487 0 0 1 16.694641 41.339111l-338.662721 339.457704a23.849487 23.849487 0 0 1-34.184265 0zM392.448255 0h238.494873v635.98633h-238.494873zM495.00105 1016.783145L155.543347 677.325441A23.849487 23.849487 0 0 1 172.237988 635.98633h678.915407a23.849487 23.849487 0 0 1 16.694641 41.339111l-338.662721 339.457704a23.849487 23.849487 0 0 1-34.184265 0z',
    symbolSize: [8, 32],
    symbolOffset: [0, -20],
    itemStyle: { color: '#FF0000' },
    name,
    coord
  };
}

// area
type LineDataItem = NonNullable<MarkLineOption['data']>[0];

function buildLineData(mark: LineMark): LineDataItem {
  const { name, label, value, data, dataProps } = mark;
  const { valueFormatter, lineStyle } = dataProps || {};
  if (typeof data === 'string') {
    return {
      symbol: 'none',
      lineStyle: { color: '#FF0000', width: 2 },
      name,
      xAxis: data
    };
  } else {
    return data.map((coord, i) => {
      if (i === 0) {
        return {
          lineStyle,
          name,
          coord,
          label: {
            formatter: `${label}\n${valueFormatter?.(value) ?? ''}`,
            lineHeight: 20,
            position: 'middle'
          }
        };
      } else {
        return { coord };
      }
    }) as LineDataItem;
  }
}

export function brushAreas(marks: Mark[], ins?: EChartsType) {
  ins?.dispatchAction(
    ChartBrush.getBrushAreas(
      marks.filter(isMarkLine).map((mark) => mark.name.split(',').map((name) => Number(name))) as [
        number,
        number
      ][]
    )
  );
}
