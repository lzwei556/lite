import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { LightSelectFilter, SeriesOption, ChartMark } from '../../../components';
import { Dayjs } from '../../../utils';
import { ValuesPropertyName } from '../../asset-common';
import { TrendDataProps, useProperties } from './useTrend';
import { AXIS_OPTIONS } from './useAxis';

export const Trend = ({
  data,
  onClick
}: {
  data: TrendDataProps['data'];
  onClick: (t: number) => void;
}) => {
  const { property, properties, setProperties } = useProperties();
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const timestamps = data.map(({ timestamp }) => timestamp);
  const [timestamp, setTimestamp] = React.useState<number | undefined>(
    data.find((d) => !!d.selected)?.timestamp
  );

  const getSeries = () => {
    const series: SeriesOption[] = [];
    const xAxisValues = timestamps.map((t) => Dayjs.format(t));
    if (data.length > 0) {
      series.push(
        ...AXIS_OPTIONS.map((o) => ({
          xAxisValues,
          data: {
            [intl.get(o.label)]: data.map(
              ({ values }) =>
                values[`${property.value}${o.key.toUpperCase()}RMS` as ValuesPropertyName]
            )
          }
        }))
      );
    }
    return series;
  };

  function handleClick(timestamp: number) {
    const data = Dayjs.format(timestamp);
    dispatchMarks({
      type: 'append_single',
      mark: { name: data, data, style: { label: { position: 'start', color: '' } } }
    });
    onClick(timestamp);
    setTimestamp(timestamp);
  }

  return (
    <ChartMark.Chart
      cardProps={{
        title: intl.get('OBJECT_TREND_CHART', {
          object: intl.get(property.label)
        }),
        extra: (
          <Space>
            <LightSelectFilter
              allowClear={false}
              options={properties.map((p) => ({ ...p, label: intl.get(p.label) }))}
              onChange={(value) =>
                setProperties((prev) => prev.map((p) => ({ ...p, selected: p.value === value })))
              }
              value={property.value}
            />
            {timestamps.length > 0 && (
              <LightSelectFilter
                allowClear={false}
                options={timestamps.map((t) => ({
                  label: Dayjs.format(t),
                  value: t
                }))}
                onChange={(t) => handleClick(t)}
                value={timestamp}
              />
            )}
          </Space>
        )
      }}
      config={{ opts: { yAxis: { name: property.unit }, grid: { top: 30 } } }}
      onEvents={{ click: (coord: [string, number]) => handleClick(Dayjs.dayjs(coord[0]).unix()) }}
      series={ChartMark.mergeMarkDatas(getSeries(), visibledMarks)}
      style={{ height: 130 }}
      toolbar={{ visibles: [], noSplit: true }}
      yAxisMeta={{ ...property, unit: property.unit }}
    />
  );
};
