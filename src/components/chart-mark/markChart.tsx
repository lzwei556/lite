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
  PointMarkSwitcherIconButton,
  ReloadIconButton
} from './components/icons';

export type Visible = 'enable_point' | 'enable_area' | 'refresh' | 'save_image';

export const Visibles: Visible[] = ['enable_point', 'enable_area', 'refresh', 'save_image'];

type PresetToolbarProps = {
  visibles?: Visible[];
  onDisableAreaSelection?: (ins: EChartsType | undefined) => void;
  onEnableAreaSelection?: (ins: EChartsType | undefined) => void;
  onRestore?: (ins: EChartsType | undefined) => void;
  imageFilename?: string;
  extra?: React.ReactNode;
  noSplit?: boolean;
};

export const MarkChart = (
  props: LineChartProps & { toolbar?: PresetToolbarProps } & { cardProps?: CardProps } & {
    children?: React.ReactNode;
  }
) => {
  const ref = useChartContext();
  const { setCursor, dispatchMarks } = useContext();
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
    reset();
    dispatchMarks({ type: 'clear' });
    toolbar?.onRestore?.(ref.current.getInstance());
  };

  return (
    <Card
      {...cardProps}
      extra={
        <Space
          split={
            !toolbar?.noSplit && (
              <Divider
                key='separation'
                type='vertical'
                style={{ marginInline: 4, borderColor: '#d3d3d3' }}
              />
            )
          }
        >
          {toolbar?.extra && <Space>{toolbar?.extra}</Space>}
          {cardProps?.extra && <Space>{cardProps?.extra}</Space>}
          <Space>
            {visibles?.includes('enable_point') && (
              <PointMarkSwitcherIconButton onClick={enablePointMark} />
            )}
            {visibles?.includes('enable_area') && (
              <AreaMarkSwitcherIconButton onClick={enableAreaMark} />
            )}
            {visibles?.includes('refresh') && <ReloadIconButton onClick={restoreHandle} />}
            {visibles?.includes('save_image') && <SaveImageIconButton chartHandler={ref.current} />}
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
