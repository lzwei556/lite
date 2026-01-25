import React from 'react';
import { Divider, Space } from 'antd';
import { useGlobalStyles } from '../../styles';
import {
  Chart,
  ChartBrush,
  ChartHandler,
  getOptions,
  LineChartProps,
  useLinedSeriesOptions
} from '../charts';
import { Card, CardProps } from '../card/card';
import { useChartContext } from '../charts';
import { SaveImageIconButton } from '../charts/saveImageIconButton';
import { DownloadIconButton, IconButtonProps } from '../icon-button';
import { RestoreIconButton, SettingsIconButton } from './components/icons';

export const MarkChart = (
  props: LineChartProps & {
    cardProps?: CardProps;
    children?: React.ReactNode;
    features?: {
      others?: React.ReactNode;
      restore?: IconButtonProps;
      saveAsImage?: IconButtonProps;
      download?: IconButtonProps;
      setup?: IconButtonProps;
    };
    toolbars?: React.ReactNode[];
  }
) => {
  const ref = useChartContext();
  const { cardProps, features, series, yAxisMeta, config, onEvents, toolbars, ...rest } = props;
  const options = getOptions(
    useLinedSeriesOptions({
      series,
      yAxisMeta,
      config: {
        ...config,
        opts: { ...config?.opts, ...ChartBrush.useBrushOptions() },
        switchs: { noDataZoom: true, noArea: true, ...config?.switchs }
      }
    })
  );
  // console.log('options', options)
  const { colorBorderStyle } = useGlobalStyles();
  const hasFeature = features && Object.keys(features).length > 0;

  useClick(props, ref);

  return (
    <Card
      {...cardProps}
      extra={
        <Space
          size={4}
          split={
            <Divider
              key='separation'
              type='vertical'
              style={{ marginInline: 4, borderColor: colorBorderStyle.color }}
            />
          }
        >
          {toolbars?.map((bar, i) => (
            <Space size={4} key={i}>
              {bar}
            </Space>
          ))}
          {hasFeature && (
            <Space size={4}>
              {features.others}
              {features.restore && (
                <RestoreIconButton {...getDefaultIconButonProps(features.restore)} />
              )}
              {features.download && (
                <DownloadIconButton {...getDefaultIconButonProps(features.download)} />
              )}
              {features.saveAsImage && <SaveImageIconButton chartHandler={ref.current} />}
              {features.setup && (
                <SettingsIconButton {...getDefaultIconButonProps(features.setup)} />
              )}
            </Space>
          )}
        </Space>
      }
    >
      <Chart
        {...rest}
        onEvents={mergeBrushEnd(excludeClickEvent(onEvents))}
        options={options}
        ref={ref}
      />
      {props.children}
    </Card>
  );
};

function useClick(props: LineChartProps, ref: React.MutableRefObject<ChartHandler>) {
  const { series, onEvents } = props;
  React.useEffect(() => {
    const ins = ref.current.getInstance();
    const handleChartClick = (paras: any) => {
      const pointInPixel = [paras.offsetX, paras.offsetY];
      if (ins?.containPixel('grid', pointInPixel) && series) {
        let xIndex;
        const coords: [string | number, number][] = series.map((s, i) => {
          xIndex = ins.convertFromPixel({ seriesIndex: i }, pointInPixel)[0];
          const yAxisValues = Object.values(s.data)[0];
          const x = s.xAxisValues[xIndex];
          const y = yAxisValues[xIndex];
          return [x, y];
        });
        if (coords.length > 0) {
          onEvents?.click?.(coords[0], xIndex);
        }
      }
    };
    const zr = ins?.getZr();
    zr?.on('click', handleChartClick);
    return () => {
      zr?.off('click', handleChartClick);
    };
  }, [series, onEvents, ref]);
}

const getDefaultIconButonProps = (params?: IconButtonProps): IconButtonProps => {
  return { size: 'small', variant: 'outlined', ...params };
};

function excludeClickEvent(events: LineChartProps['onEvents']) {
  if (!events) return events;
  const onEvents: LineChartProps['onEvents'] = {};
  for (const eventName in events) {
    if (Object.prototype.hasOwnProperty.call(events, eventName) && eventName !== 'click') {
      onEvents[eventName] = events[eventName];
    }
  }
  return onEvents;
}

function mergeBrushEnd(events: LineChartProps['onEvents']) {
  if (!events) return events;
  const { brushEnd, ...rest } = events;
  return brushEnd
    ? {
        ...rest,
        brushEnd: (paras: any) => {
          const areas = paras.areas;
          if (areas && Array.isArray(areas)) {
            const areaCoords = areas.map(({ coordRange }) => coordRange) as [number, number][];
            brushEnd(areaCoords);
          }
        }
      }
    : events;
}
