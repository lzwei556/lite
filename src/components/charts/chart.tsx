import React from 'react';
import { Empty } from 'antd';
import * as echarts from 'echarts/core';
import { BarChart, PieChart, LineChart, ScatterChart, TreeChart, GaugeChart } from 'echarts/charts';
import {
  DatasetComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  PolarComponent,
  BrushComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useDeepCompareEffect, useSize } from 'ahooks';
import type { ComposeOption } from 'echarts/core';
import type {
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
  LegendComponentOption,
  PolarComponentOption,
  DataZoomComponentOption,
  BrushComponentOption,
  MarkLineComponentOption,
  MarkPointComponentOption
} from 'echarts/components';
import type {
  BarSeriesOption,
  PieSeriesOption,
  LineSeriesOption,
  ScatterSeriesOption,
  TreeSeriesOption,
  GaugeSeriesOption
} from 'echarts/charts';
import type {
  AngleAxisComponentOption,
  RadiusAxisComponentOption,
  TitleComponentOption,
  XAXisComponentOption,
  YAXisComponentOption
} from 'echarts';
import { useLocaleContext } from '../../localeProvider';
import { Flex } from '../flex';

export type ECOptions = ComposeOption<
  | DatasetComponentOption
  | DataZoomComponentOption
  | GridComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | AngleAxisComponentOption
  | RadiusAxisComponentOption
  | XAXisComponentOption
  | YAXisComponentOption
  | PolarComponentOption
  | BrushComponentOption
  | MarkLineComponentOption
  | MarkPointComponentOption
  | BarSeriesOption
  | PieSeriesOption
  | LineSeriesOption
  | ScatterSeriesOption
  | TreeSeriesOption
>;

export type ECSerionOptions =
  | BarSeriesOption
  | PieSeriesOption
  | LineSeriesOption
  | ScatterSeriesOption
  | TreeSeriesOption
  | GaugeSeriesOption;

echarts.use([
  DatasetComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  PolarComponent,
  BrushComponent,
  MarkLineComponent,
  MarkPointComponent,
  BarChart,
  PieChart,
  LineChart,
  ScatterChart,
  TreeChart,
  GaugeChart,
  CanvasRenderer
]);

const EChart = React.forwardRef(function EChart(
  props: ChartProps,
  ref: React.ForwardedRef<ChartHandler>
) {
  const chartDomRef = React.useRef<HTMLDivElement | null>(null);
  const [chartIns, setChartIns] = React.useState<echarts.ECharts>();
  const chartDomSize = useSize(chartDomRef);
  const { language } = useLocaleContext();
  React.useEffect(() => {
    const chartDom = chartDomRef.current;
    const chart = echarts.init(chartDom, null, {
      renderer: 'canvas',
      locale: language === 'zh-CN' ? 'ZH' : 'EN'
    });
    setChartIns(chart);
    return () => {
      if (chart) {
        chart.dispose();
        setChartIns(undefined);
      }
    };
  }, [language]);

  React.useEffect(() => {
    const evs = props.onEvents || {};
    if (chartIns) {
      bindEvents(chartIns, evs);
    }
    return () => {
      if (chartIns) {
        unbindEvents(chartIns, evs);
      }
    };
  }, [chartIns, props.onEvents]);

  const { tooltip, ...rest } = props.options || {};

  useDeepCompareEffect(() => {
    if (chartIns) {
      chartIns.setOption(props.options!, { replaceMerge: ['dataset', 'series'] });
      if (props.loading) {
        chartIns.showLoading();
      } else {
        chartIns.hideLoading();
      }
    }
  }, [chartIns, rest, props.loading]); //ignore tooltip property when props.options is compared with prev

  React.useEffect(() => {
    const handleResize = () => {
      if (chartIns) {
        chartIns.resize();
      }
    };
    handleResize();
  }, [chartIns, chartDomSize]);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        getInstance() {
          return chartDomRef.current ? echarts.getInstanceByDom(chartDomRef.current) : undefined;
        }
      };
    },
    []
  );

  return <div ref={chartDomRef} style={props.style}></div>;
});

export type ChartProps = {
  options?: ECOptions;
  loading?: boolean;
  onEvents?: Record<string, Function>;
  style?: React.CSSProperties;
};

export type ChartHandler = {
  getInstance: () => echarts.ECharts | undefined;
};

export const Chart = React.forwardRef(function Chart(
  props: ChartProps,
  ref: React.ForwardedRef<ChartHandler>
) {
  const style = { height: 300, ...props.style };
  if (
    props.options === null ||
    props.options === undefined ||
    (props.options.series &&
      Array.isArray(props.options.series) &&
      props.options.series.length === 0)
  ) {
    return (
      <Flex style={style} justify='center' align='center'>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Flex>
    );
  }
  return <EChart {...props} style={style} ref={ref} />;
});

function bindEvents(instance: echarts.ECharts, events: ChartProps['onEvents']) {
  function _bindEvent(eventName: string, func: Function) {
    if (typeof eventName === 'string' && typeof func === 'function') {
      instance.on(eventName, (param) => {
        func(param, instance);
      });
    }
  }

  for (const eventName in events) {
    if (Object.prototype.hasOwnProperty.call(events, eventName)) {
      _bindEvent(eventName, events[eventName]);
    }
  }
}

function unbindEvents(instance: echarts.ECharts, events: ChartProps['onEvents']) {
  for (const eventName in events) {
    if (Object.prototype.hasOwnProperty.call(events, eventName)) {
      instance.off(eventName);
    }
  }
}
