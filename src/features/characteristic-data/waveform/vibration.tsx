import React from 'react';
import { VibrationPropertyKey, WaveformData, WaveformProperty, WaveformVibration } from '../types';
import { Card, LineChart, SeriesOption } from 'components';
import { PROPERTIES_WITH_ENVELOPE } from './common';
import { Checkbox, CheckboxChangeEvent, Space } from 'antd';
import { Translation } from 'locales/utils';
import { AxisWithVibrationDirectionLabel } from 'common';
import { useGlobalStyles } from 'styles';

type Props = {
  axis: AxisWithVibrationDirectionLabel;
  data: WaveformData;
  filters: JSX.Element[];
  property: WaveformProperty;
};

export const Vibration = (props: Props) => {
  const { visible, checkboxProps, isEnvelopeShow } = useShowEnvelopeSwitch(props.property);
  return (
    <Card
      extra={
        <Space>
          {props.filters}
          {visible && <Checkbox {...checkboxProps} />}
        </Space>
      }
    >
      <LineChart {...useChartProps({ ...props, isEnvelopeShow })} />
    </Card>
  );
};

const useShowEnvelopeSwitch = (property: WaveformProperty) => {
  const [isEnvelopeShow, setIsShowEnvelope] = React.useState(false);
  return {
    checkboxProps: {
      children: Translation.get('feature.waveform.envelope.enabled'),
      onChange: (e: CheckboxChangeEvent) => {
        setIsShowEnvelope(e.target.checked);
      },
      value: isEnvelopeShow
    },
    isEnvelopeShow,
    visible: PROPERTIES_WITH_ENVELOPE.includes(property.key as VibrationPropertyKey)
  };
};

const useChartProps = ({
  axis,
  data,
  isEnvelopeShow,
  property
}: Props & {
  isEnvelopeShow: boolean;
}) => {
  const { colorBorderStyle } = useGlobalStyles();
  const { highEnvelopes, lowEnvelopes, values, xAxis, xAxisUnit, frequency, yAxisUnit } =
    data.values as WaveformVibration;
  const seriesName = Translation.get(axis.label);
  const series: SeriesOption[] = [];
  let config;
  if (xAxis) {
    const rawOptions =
      xAxis.length > 50000
        ? {
            smooth: true,
            sampling: 'lttb' as 'lttb'
          }
        : { smooth: true };
    series.push({
      data: { [seriesName]: values },
      xAxisValues: xAxis.map((n) => n.toFixed(Number.isInteger(n) ? 0 : 3)),
      raw: rawOptions
    });
    if (isEnvelopeShow) {
      const envelopeRawOptions = {
        ...rawOptions,
        lineStyle: {
          opacity: 0
        },
        areaStyle: colorBorderStyle,
        stack: 'confidence-band'
      };
      series.push({
        data: { [Translation.get('feature.waveform.envelope.high')]: highEnvelopes },
        xAxisValues: xAxis.map((n) => n.toFixed(Number.isInteger(n) ? 0 : 3)),
        raw: envelopeRawOptions
      });
      series.push({
        data: { [Translation.get('feature.waveform.envelope.low')]: lowEnvelopes },
        xAxisValues: xAxis.map((n) => n.toFixed(Number.isInteger(n) ? 0 : 3)),
        raw: envelopeRawOptions
      });
    }
    config = {
      opts: {
        animation: false,
        dataZoom: [{ start: 0, end: 100 }],
        title: { text: `${(frequency ?? 0) / 1000}KHz` },
        xAxis: {
          name: xAxisUnit,
          axisLabel: {
            formatter: (value: string) => `${Number(value).toFixed(0)}`,
            interval: Math.floor(xAxis.length / 20)
          }
        },
        grid: { top: 60, bottom: 60, right: 40 }
      },
      switchs: { noDataZoom: false }
    };
  }

  return {
    config,
    series,
    style: { height: 680 },
    yAxisMeta: {
      interval: 0,
      precision: property.precision,
      unit: property?.unit ?? yAxisUnit
    }
  };
};
