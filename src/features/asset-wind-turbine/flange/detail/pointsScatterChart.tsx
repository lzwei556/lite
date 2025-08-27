import React from 'react';
import { useNavigate } from 'react-router-dom';
import intl from 'react-intl-universal';
import { buildCustomTooltip, Chart, chartColors } from '../../../../components';
import { isMobile } from '../../../../utils/deviceDetection';
import { ColorHealth } from '../../../../constants/color';
import { getValue, roundValue } from '../../../../utils/format';
import { MonitoringPointTypeValue } from '../../../../config';
import {
  Asset,
  ASSET_PATHNAME,
  AssetRow,
  MonitoringPointRow,
  Point,
  Points
} from '../../../../asset-common';
import { useGlobalStyles } from '../../../../styles';
import { AlarmLevel, getColorByValue } from '../../../alarm';

export const PointsScatterChart = ({
  asset,
  big,
  style
}: {
  asset: AssetRow;
  big?: boolean;
  style?: React.CSSProperties;
}) => {
  const { monitoringPoints, attributes } = asset;
  const navigate = useNavigate();
  const { colorWhiteStyle } = useGlobalStyles();
  let options;
  const points = Points.filter(monitoringPoints);
  if (points.length > 0) {
    options = buildCirclePointsChartOfFlange(points, colorWhiteStyle.color, attributes, big);
  }

  return (
    <Chart
      options={options}
      onEvents={{
        click: (paras: any) => {
          const index = paras.value[2];
          if (points.length > index) {
            navigate(`/${ASSET_PATHNAME}/${points[index].id}-${points[index].type}`, {
              state: [`${points[index].id}-${points[index].type}`]
            });
          }
        }
      }}
      style={{ height: 600, ...style }}
    />
  );
};

function buildCirclePointsChartOfFlange(
  measurements: MonitoringPointRow[],
  color: string,
  attributes?: AssetRow['attributes'],
  isBig: boolean = false
) {
  const count = measurements.length;
  if (!count) return undefined;
  const polar: { radius: number }[] = [];
  const angleAxis: any = [];
  const radiusAxis: any = [];
  const series: any = [];
  const sortedMeasurements = Points.sort(measurements);
  const outer = generateOuter(sortedMeasurements, color, isBig);
  polar.push(outer.radius);
  angleAxis.push(outer.angleAxis);
  radiusAxis.push(outer.radiusAxis);
  series.push(outer.series);

  const actuals = generateActuals(sortedMeasurements, isBig);
  polar.push(actuals.radius);
  angleAxis.push(actuals.angleAxis);
  let max = getMax(actuals.max, attributes, measurements[0].type);
  let min = actuals.min || -1;
  if (measurements[0].type === MonitoringPointTypeValue.BoltLoosening) {
    if (max < 5) {
      max = 10;
    }
    min = -(max * 2);
  }
  radiusAxis.push({ ...actuals.radiusAxis, max, min });
  series.push(actuals.series);

  const legends = [];
  const unit = Point.getPropertiesByType(measurements[0].type, measurements[0].properties).filter(
    (p) => p.first
  )?.[0]?.unit;
  if (
    measurements[0].type === MonitoringPointTypeValue.BoltPreload &&
    checkValidAttr(attributes, 'normal', min)
  ) {
    const seriesName = `${intl.get('RATING')} ${attributes?.normal?.value}${unit}`;
    const normal = getSeries(ColorHealth, attributes?.normal?.value, seriesName);
    legends.push({ name: seriesName, itemStyle: { color: ColorHealth } });
    series.push(normal.series);
  }

  if (
    measurements[0].type === MonitoringPointTypeValue.BoltLoosening &&
    checkValidAttr(attributes, 'initial', min)
  ) {
    const seriesName = `${intl.get('INITIAL_VALUE')} ${attributes?.initial?.value}${unit}`;
    const initial = getSeries(ColorHealth, attributes?.initial?.value, seriesName);
    legends.push({ name: seriesName, itemStyle: { color: ColorHealth } });
    series.push(initial.series);
  }

  if (checkValidAttr(attributes, 'info', min)) {
    const seriesName = `${intl.get(`leveled.alarm.${AlarmLevel.Minor}`)} ${
      attributes?.info?.value
    }${unit}`;
    const color = getColorByValue(AlarmLevel.Minor);
    const info = getSeries(color, attributes?.info?.value, seriesName);
    legends.push({ name: seriesName, itemStyle: { color } });
    series.push(info.series);
  }

  if (checkValidAttr(attributes, 'warn', min)) {
    const seriesName = `${intl.get(`leveled.alarm.${AlarmLevel.Major}`)}  ${
      attributes?.warn?.value
    }${unit}`;
    const color = getColorByValue(AlarmLevel.Major);
    const warn = getSeries(color, attributes?.warn?.value, seriesName);
    legends.push({ name: seriesName, itemStyle: { color } });
    series.push(warn.series);
  }

  if (checkValidAttr(attributes, 'danger', min)) {
    const seriesName = `${intl.get(`leveled.alarm.${AlarmLevel.Critical}`)} ${
      attributes?.danger?.value
    }${unit}`;
    const color = getColorByValue(AlarmLevel.Critical);
    const danger = getSeries(color, attributes?.danger?.value, seriesName);
    legends.push({ name: seriesName, itemStyle: { color } });
    series.push(danger.series);
  }

  return {
    animation: false,
    polar,
    angleAxis,
    radiusAxis,
    legend: {
      data: legends,
      bottom: isMobile ? 50 : 0
    },
    series,
    tooltip: {}
  };
}

function checkValidAttr(
  attributes: AssetRow['attributes'],
  key: keyof Pick<
    Required<Required<AssetRow>['attributes']>,
    'normal' | 'initial' | 'info' | 'warn' | 'danger'
  >,
  reference: number,
  abs?: boolean
) {
  if (attributes) {
    const item = attributes[key];
    if (item) {
      if (abs) {
        return item.enabled && item.value && Math.abs(item.value) > reference;
      }
      return item.enabled && item.value && item.value > reference;
    }
    return false;
  }
  return false;
}

function getMax(max: number, attributes: AssetRow['attributes'], type: number) {
  let final = max;
  if (
    type === MonitoringPointTypeValue.BoltPreload &&
    checkValidAttr(attributes, 'normal', final, true)
  ) {
    final = Math.abs(attributes?.normal?.value as number);
  }
  if (
    type === MonitoringPointTypeValue.BoltLoosening &&
    checkValidAttr(attributes, 'initial', final, true)
  ) {
    final = Math.abs(attributes?.initial?.value as number);
  }
  if (checkValidAttr(attributes, 'info', final, true)) {
    final = Math.abs(attributes?.info?.value as number);
  }
  if (checkValidAttr(attributes, 'warn', final, true)) {
    final = Math.abs(attributes?.warn?.value as number);
  }
  if (checkValidAttr(attributes, 'danger', final, true)) {
    final = Math.abs(attributes?.danger?.value as number);
  }
  return final;
}

function generateOuter(measurements: MonitoringPointRow[], color: string, isBig: boolean = false) {
  let radius: any = { radius: isBig ? 180 : 150 };
  if (isMobile) {
    radius = { radius: isBig ? '90%' : '85%' };
  }
  const angleAxis = {
    startAngle: 0,
    clockwise: false,
    boundaryGap: false,
    axisLine: { show: true, lineStyle: { type: 'dashed' } },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: { show: false },
    min: 0,
    max: 360
  };
  const radiusAxis = {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: { show: false }
  };
  const seriesData = measurements.map(({ name, attributes, data, alertLevel }, index) => {
    let field = Point.getPropertiesByType(measurements[0].type, measurements[0].properties).filter(
      (p) => p.first
    )?.[0];
    let value = NaN;
    if (field && data) {
      value = data.values[field.key] as number;
    }
    return {
      name,
      value: [1, (360 / measurements.length) * index, index],
      label: {
        show: true,
        color,
        formatter: () => attributes?.index
      },
      tooltip: {
        formatter: buildCustomTooltip({
          title: alertLevel && alertLevel > 0 ? intl.get(`leveled.alarm.${alertLevel}`) : undefined,
          items: [{ marker: '', name, text: getValue({ value, ...field }) }]
        })
      },
      itemStyle: {
        opacity: 1,
        color: Asset.Status.getColorByValue(alertLevel || 0)
      }
    };
  });
  const series = {
    type: 'scatter',
    name: 'outer',
    coordinateSystem: 'polar',
    polarIndex: 0,
    symbol:
      'path://M675.9 107.2H348.1c-42.9 0-82.5 22.9-104 60.1L80 452.1c-21.4 37.1-21.4 82.7 0 119.8l164.1 284.8c21.4 37.2 61.1 60.1 104 60.1h327.8c42.9 0 82.5-22.9 104-60.1L944 571.9c21.4-37.1 21.4-82.7 0-119.8L779.9 167.3c-21.4-37.1-61.1-60.1-104-60.1z',
    symbolSize: 30,
    data: seriesData,
    zlevel: 10
  };
  return { radius, angleAxis, radiusAxis, series };
}

function generateActuals(measurements: MonitoringPointRow[], isBig: boolean = false) {
  let radius: any = { radius: isBig ? 150 : 120 };
  if (isMobile) {
    radius = { radius: isBig ? '85%' : '80%' };
  }
  const seriesData: any = [];
  let field = Point.getPropertiesByType(measurements[0].type, measurements[0].properties).filter(
    (p) => p.first
  )?.[0];
  let max = 0;
  let min = 0;
  measurements.forEach(({ data, name }, index) => {
    let value = NaN;
    if (field && data) {
      value = roundValue(data.values[field.key] as number, field.precision);
      if (value) {
        if (Math.abs(value) > max) max = Math.abs(value);
        if (value < min) min = value;
      }
    }
    if (!Number.isNaN(value)) seriesData.push([value, (index * 360) / measurements.length]);
  });
  const angleAxis = {
    polarIndex: 1,
    type: 'value',
    startAngle: 0,
    clockwise: false,
    boundaryGap: false,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: { show: false },
    min: 0,
    max: 360
  };
  const radiusAxis = {
    polarIndex: 1,
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: { show: false },
    max,
    min: max / 2
  };
  const series = {
    type: 'line',
    name: intl.get('ACTUAL_VALUE'),
    data: [...seriesData, seriesData[0]],
    itemStyle: { color: chartColors[0] },
    tooltip: { show: false },
    zlevel: 15,
    coordinateSystem: 'polar',
    polarIndex: 1,
    smooth: false
  };
  return { series, max, radius, angleAxis, radiusAxis, min };
}

function getSeries(color: string, value: number | string | undefined, name: string) {
  const data = [];
  for (let index = 0; index < 360; index++) {
    data.push([value, index]);
  }
  const series = {
    type: 'line',
    coordinateSystem: 'polar',
    polarIndex: 1,
    data,
    symbol: 'none',
    symbolSize: 0.01,
    name,
    lineStyle: { type: 'dashed', color, opacity: 0.6 }
  };
  return { series };
}
