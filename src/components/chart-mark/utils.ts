import { EChartsType, MarkLineOption, MarkPointOption } from 'echarts/types/dist/shared';
import { SeriesOption, ChartBrush } from '../charts';
import { LineMark, Mark, PointMark } from './types';

export function mergeMarkDatas({
  series,
  marks,
  lineStyle,
  pointStyle
}: {
  series: SeriesOption[];
  marks: Mark[];
  lineStyle?: any;
  pointStyle?: any;
}) {
  const { lines, points } = buildMarkDatas(marks);
  return series.map((s) => {
    const { markLine: prevLine, markPoint: prevPoint, ...rest } = s.raw || {};
    const lineData = prevLine?.data ?? [];
    const markLine = { ...prevLine, ...lineStyle, data: lineData.concat(lines) };
    const pointData = prevPoint?.data ?? [];
    const markPoint = { ...prevPoint, ...pointStyle, data: pointData.concat(points) };
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
  const { data: coord, name, label: markLabel, value, chartPorps } = mark;
  const { label, itemStyle, symbol } = chartPorps || {};
  const color = '#FF0000';
  const labelProps = {
    show: true,
    color,
    position: 'top',
    formatter: markLabel && value ? `${markLabel}\n${value ?? ''}` : undefined,
    ...label
  };
  const symbolProps =
    symbol ??
    'path://M392.448255 0h238.494873v635.98633h-238.494873zM495.00105 1016.783145L155.543347 677.325441A23.849487 23.849487 0 0 1 172.237988 635.98633h678.915407a23.849487 23.849487 0 0 1 16.694641 41.339111l-338.662721 339.457704a23.849487 23.849487 0 0 1-34.184265 0zM392.448255 0h238.494873v635.98633h-238.494873zM495.00105 1016.783145L155.543347 677.325441A23.849487 23.849487 0 0 1 172.237988 635.98633h678.915407a23.849487 23.849487 0 0 1 16.694641 41.339111l-338.662721 339.457704a23.849487 23.849487 0 0 1-34.184265 0z';
  const itemStyleProps = { color, ...itemStyle };
  return {
    label: labelProps,
    symbol: symbolProps,
    symbolSize: [8, 32],
    symbolOffset: [0, -20],
    itemStyle: itemStyleProps,
    name,
    coord
  };
}

// area
type LineDataItem = NonNullable<MarkLineOption['data']>[0];

function buildLineData(mark: LineMark): LineDataItem {
  const { name, label, value, data, chartPorps } = mark;
  if (typeof data === 'string') {
    return { ...chartPorps, name, xAxis: data };
  } else {
    return data.map((coord, i) => {
      if (i === 0) {
        return {
          ...chartPorps,
          name,
          coord,
          label: {
            ...chartPorps?.label,
            formatter:
              label && value
                ? `${label}\n${
                    chartPorps?.label?.formatterFn ? chartPorps?.label?.formatterFn(value) : value
                  }`
                : undefined
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

export const Axis_Mark_Line_Style_Props = {
  symbol: 'none',
  label: { show: false },
  lineStyle: { color: '#FF0000', width: 2 }
};
