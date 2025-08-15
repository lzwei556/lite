import React from 'react';
import { Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Language, useLocaleContext } from '../../../../localeProvider';
import { Card, CardProps, Chart, getOptions } from '../../../../components';
import { getValue, roundValue } from '../../../../utils/format';
import { MonitoringPointTypeValue } from '../../../../config';
import { HistoryData } from '../../../../asset-common';

type Data = {
  name: string;
  data: number[][];
  height?: number;
  radius?: number;
};

export const PointsScatterChart = ({
  data,
  style,
  type,
  dynamicData = [],
  showTitle = true,
  cardProps
}: {
  data: {
    name: string;
    history?: HistoryData;
    height?: number;
    radius?: number;
  }[];
  style?: React.CSSProperties;
  type: MonitoringPointTypeValue;
  dynamicData?: Data[];
  showTitle?: boolean;
  cardProps?: CardProps;
}) => {
  const { language } = useLocaleContext();
  const transformedData: Data[] = [];
  if (data.length > 0) {
    transformedData.push(...getDataOfCircleChart(data, type));
  } else if (dynamicData && dynamicData.length > 0) {
    transformedData.push(...dynamicData);
  }
  const dispalyPrefix = `${intl.get(
    `FIELD_DISPLACEMENT_${type === MonitoringPointTypeValue.BaseInclination ? 'AXIAL' : 'RADIAL'}`
  )}${language === 'en-US' ? ' ' : ''}${intl.get('FIELD_DISPLACEMENT')}`;
  const options = buildCirclePointsChartOfTower({
    datas: transformedData,
    titles: [dispalyPrefix, intl.get('FIELD_DIRECTION')],
    lang: language
  });

  return cardProps ? (
    <Card
      {...cardProps}
      title={
        showTitle ? (
          <Title transformedData={transformedData} dispalyPrefix={dispalyPrefix} />
        ) : undefined
      }
    >
      <Chart
        options={options ? getOptions(options as any) : undefined}
        style={{ height: 600, ...style }}
      />
    </Card>
  ) : (
    <Chart
      options={options ? getOptions(options as any) : undefined}
      style={{ height: 600, ...style }}
    />
  );
};

function Title({
  transformedData,
  dispalyPrefix
}: {
  transformedData: Data[];
  dispalyPrefix: string;
}) {
  const { main, displacement, direction } = getTitles(transformedData, dispalyPrefix);
  if (displacement.value || direction.value) {
    return [displacement, direction].map(({ label, value, unit }, i) => (
      <Space key={i} style={{ display: 'flex', lineHeight: 1.35, fontSize: 14, fontWeight: 400 }}>
        <Typography.Text type='secondary'>{label}</Typography.Text>
        {getValue({ value, unit })}
      </Space>
    ));
  } else {
    return <>{main}</>;
  }
}

function getTitles(datas: Data[], dispalyPrefix: string) {
  let displacement: number | undefined;
  let direction: number | undefined;
  datas.forEach(({ data }) => {
    const displacements = data.map((item) => item[0]);
    displacement = Math.max(...displacements.filter((d) => !Number.isNaN(d)));
    direction = data.map((item) => item[1])[displacements.indexOf(displacement)];
  });

  return {
    main: intl.get('SCATTERGRAM'),
    displacement: { label: dispalyPrefix, value: displacement, unit: 'mm' },
    direction: { label: intl.get('FIELD_DIRECTION'), value: direction, unit: '°' }
  };
}

function buildCirclePointsChartOfTower({
  datas,
  titles,
  lang = 'en-US'
}: {
  datas: Data[];
  titles: string[];
  lang?: Language;
}) {
  const [displacement, direction] = titles;
  let max = undefined;
  const series: any = [];
  if (!datas || datas.length === 0) {
    return undefined;
  }
  datas.forEach(({ name, data, radius }) => {
    const displacements = data.map((item) => item[0]);
    series.push({
      type: 'scatter',
      coordinateSystem: 'polar',
      data,
      name,
      symbolSize: 6
    });
    max = getMaxRadius(displacements, radius ? 10 : undefined);
  });
  const onlyOneSeries = series.length === 1;
  return {
    legend: { show: false },
    tooltip: {
      formatter: ({
        seriesName,
        data: [displacementValue, directionValue]
      }: {
        seriesName: string;
        data: [number, number];
      }) => {
        const rest = `${displacement} ${displacementValue} mm<br/>${direction} ${directionValue} °`;
        return onlyOneSeries ? rest : `${seriesName}<br/>${rest}`;
      },
      confine: true
    },
    polar: { radius: 100, center: ['50%', '50%'] },
    angleAxis: {
      type: 'value',
      min: -180,
      max: 180,
      startAngle: 180,
      clockwise: false,
      boundaryGap: false,
      axisLine: { show: true, lineStyle: { type: 'dashed' } },
      axisTick: { show: true },
      axisLabel: {
        show: true,
        formatter: (value: number) => {
          switch (value) {
            case 0:
              return `${value} {direction|${lang === 'zh-CN' ? '东' : 'East'}}`;
            case 90:
              return ` {direction|${lang === 'zh-CN' ? '北' : 'North'}}\r\n${value}`;
            case -180:
              return `{direction|${lang === 'zh-CN' ? '西' : 'West'}} ${value}`;
            case -90:
              return `${value}\r\n{direction|${lang === 'zh-CN' ? '南' : 'South'}}`;
            default:
              return value;
          }
        },
        rich: {
          direction: {
            fontWeight: 'bold',
            lineHeight: 20
          }
        }
      },
      splitLine: { show: false }
    },
    radiusAxis: {
      type: 'value',
      splitNumber: 3,
      max,
      axisLabel: { hideOverlap: true }
    },
    series
  };
}

export function getDataOfCircleChart(
  datas: {
    name: string;
    history?: HistoryData;
    height?: number;
    radius?: number;
  }[],
  type: MonitoringPointTypeValue
) {
  const ret: {
    name: string;
    data: number[][];
    height?: number;
    radius?: number;
  }[] = [];
  datas.forEach(({ name, history, height, radius }) => {
    if (!history || history.length === 0) return [];
    const directions: number[] = [];
    const displacements: number[] = [];
    history.forEach(({ values }) => {
      values.forEach(({ data }) => {
        if (data['FIELD_DIRECTION'] != null) {
          directions.push(roundValue(data['FIELD_DIRECTION'], 2));
        }
        const key = `FIELD_DISPLACEMENT_${
          type === MonitoringPointTypeValue.BaseInclination ? 'AXIAL' : 'RADIAL'
        }`;
        if (data[key] !== undefined) {
          displacements.push(roundValue(data[key], 2));
        }
      });
    });
    if (datas.length === 0 || displacements.length === 0 || directions.length === 0) {
      ret.push({ name, data: [], height, radius });
    } else {
      ret.push({
        name,
        data: displacements
          .map((data, index) => [data, directions[index]])
          .filter((d) => !Number.isNaN(d[0])),
        height,
        radius
      });
    }
  });
  return ret;
}

export function getMaxRadius(displacements: number[], heightOrRadius: number = 0) {
  const max = Math.max(...displacements);
  return max >= heightOrRadius && heightOrRadius >= 0 ? 1.5 * max : heightOrRadius;
}
