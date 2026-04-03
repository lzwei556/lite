import React from 'react';
import intl from 'react-intl-universal';
import { LightSelectFilter, SeriesOption, ChartMark } from 'components';
import { Dayjs } from 'utils';
import { ValuesPropertyName } from 'asset-common';
import { TrendDataProps } from './useTrend';
import { useDownloadRawDataHandler } from './useDownladRawDataHandler';
import { PropertiesSelect, usePropertiesFilters } from './filters';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';

export const Trend = ({
  id,
  attributes,
  data,
  onClick
}: {
  id: number;
  attributes: TMonitoringPoint.Base['attributes'];
  data: TrendDataProps['data'];
  onClick: (t: number) => void;
}) => {
  const propertyFilters = usePropertiesFilters();
  const property = propertyFilters.property;
  const { marks, dispatchMarks } = ChartMark.useContext();
  const timestamps = data.map(({ timestamp }) => timestamp);
  const [timestamp, setTimestamp] = React.useState<number | undefined>(
    data.find((d) => !!d.selected)?.timestamp
  );
  const { options } = OMonitoringPoint.Settings.Vibration.useAxisWithVibrationDirection(
    attributes as TMonitoringPoint.Settings.VibrationDirection
  );
  const downlaodRawDataHandler = useDownloadRawDataHandler(id, timestamp, 'originalDomain');
  const chartProps = ChartMark.useAxisMarkLineStyleProps();
  const getSeries = () => {
    const series: SeriesOption[] = [];
    const xAxisValues = timestamps.map((t) => Dayjs.format(t));
    if (data.length > 0) {
      series.push(
        ...options.map((o) => ({
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
      mark: { name: data, data, chartProps, type: 'Peak' }
    });
    onClick(timestamp);
    setTimestamp(timestamp);
  }

  return (
    <ChartMark.Chart
      cardProps={{
        title: intl.get('OBJECT_TREND_CHART', {
          object: intl.get(property.label)
        })
      }}
      config={{ opts: { yAxis: { name: property.unit }, grid: { top: 30 } } }}
      features={{
        download: {
          tooltipProps: { title: intl.get('download.vibration.original.data') },
          onClick() {
            downlaodRawDataHandler();
          }
        },
        restore: {
          onClick() {
            if (timestamps.length > 0) {
              const latest = timestamps[timestamps.length - 1];
              if (latest !== timestamp) {
                handleClick(latest);
              }
            }
          }
        },
        saveAsImage: {}
      }}
      onEvents={{
        click: (coord: [string, number]) => handleClick(Dayjs.toTimestamp(Dayjs.dayjs(coord[0])))
      }}
      series={ChartMark.useMergeMarkDatas({
        series: getSeries(),
        marks,
        lineStyle: { symbol: 'none' }
      })}
      style={{ height: 130 }}
      toolbars={[
        <>
          <PropertiesSelect {...propertyFilters} />
          {timestamps.length > 0 && (
            <LightSelectFilter
              allowClear={false}
              options={timestamps
                .sort((prev, crt) => crt - prev)
                .map((t) => ({
                  label: Dayjs.format(t),
                  value: t
                }))}
              onChange={(t) => handleClick(t)}
              value={timestamp}
            />
          )}
        </>
      ]}
      yAxisMeta={{ ...property, unit: property.unit }}
    />
  );
};
