import React from 'react';
import { Divider, Space } from 'antd';
import { EChartsType } from 'echarts/core';
import {
  Chart,
  ChartBrush,
  ChartHandler,
  getOptions,
  LineChartProps,
  useLinedSeriesOptions
} from '../charts';
import { Card, CardProps } from '../card';
import { useChartContext } from '../charts';
import { SaveImageIconButton } from '../charts/saveImageIconButton';
import { useContext } from './context';
import {
  AreaMarkSwitcherIconButton,
  DownloadIconButton,
  PointMarkSwitcherIconButton,
  RestoreIconButton,
  SettingsIconButton
} from './components/icons';

export type Visible =
  | 'enable_point'
  | 'enable_area'
  | 'refresh'
  | 'save_image'
  | 'download'
  | 'set';

export const Visibles: Visible[] = [
  'enable_point',
  'enable_area',
  'refresh',
  'save_image',
  'download',
  'set'
];

type PresetToolbarProps = {
  visibles?: Visible[];
  onDisableAreaSelection?: (ins: EChartsType | undefined) => void;
  onEnableAreaSelection?: (ins: EChartsType | undefined) => void;
  onRestore?: (ins: EChartsType | undefined) => void;
  imageFilename?: string;
  extra?: React.ReactNode;
  onRefresh?: () => void;
  download?: {
    onClick: () => void;
    tooltip: string;
  };
  set?: {
    onClick: () => void;
    tooltip: string;
  };
};

export const MarkChart = (
  props: LineChartProps & { toolbar?: PresetToolbarProps } & { cardProps?: CardProps } & {
    children?: React.ReactNode;
  }
) => {
  const ref = useChartContext();
  const { cursor, setCursor, dispatchMarks } = useContext();
  const { cardProps, series, yAxisMeta, config, onEvents, toolbar, ...rest } = props;
  const visibles = toolbar?.visibles ?? Visibles;
  const options = getOptions(
    useLinedSeriesOptions(series, yAxisMeta, {
      ...config,
      opts: { ...config?.opts, ...ChartBrush.Options },
      switchs: { noDataZoom: true, noArea: true, ...config?.switchs }
    })
  );

  useClick(props, ref);

  const reset = () => {
    setCursor('point');
    ref.current.getInstance()?.dispatchAction(ChartBrush.ActionPayload.clear_areas);
    ref.current.getInstance()?.dispatchAction(ChartBrush.ActionPayload.disable);
  };

  const enablePointMark = () => {
    reset();
    toolbar?.onDisableAreaSelection?.(ref.current.getInstance());
  };

  const enableAreaMark = () => {
    setCursor('line');
    ref.current.getInstance()?.dispatchAction(ChartBrush.ActionPayload.enable);
    toolbar?.onEnableAreaSelection?.(ref.current.getInstance());
  };

  const restoreHandle = () => {
    if (toolbar?.onRefresh) {
      toolbar?.onRefresh();
    } else {
      reset();
      dispatchMarks({ type: 'clear' });
      toolbar?.onRestore?.(ref.current.getInstance());
    }
  };

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
              style={{ marginInline: 4, borderColor: '#d3d3d3' }}
            />
          }
        >
          {toolbar?.extra && <Space size={4}>{toolbar?.extra}</Space>}
          {cardProps?.extra && <Space size={4}>{cardProps?.extra}</Space>}
          <Space size={4}>
            {visibles?.includes('enable_point') && (
              <PointMarkSwitcherIconButton
                onClick={enablePointMark}
                variant={cursor === 'point' ? 'solid' : 'outlined'}
              />
            )}
            {visibles?.includes('enable_area') && (
              <AreaMarkSwitcherIconButton
                onClick={enableAreaMark}
                variant={cursor === 'line' ? 'solid' : 'outlined'}
              />
            )}
            {visibles?.includes('refresh') && <RestoreIconButton onClick={restoreHandle} />}
            {visibles?.includes('download') && (
              <DownloadIconButton
                onClick={toolbar?.download?.onClick}
                tooltip={toolbar?.download?.tooltip}
              />
            )}
            {visibles?.includes('save_image') && <SaveImageIconButton chartHandler={ref.current} />}
            {visibles?.includes('set') && (
              <SettingsIconButton onClick={toolbar?.set?.onClick} tooltip={toolbar?.set?.tooltip} />
            )}
          </Space>
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
