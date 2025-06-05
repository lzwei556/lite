import React from 'react';
import { Divider, Space } from 'antd';
import { Card, CardProps } from '../card';
import { Chart, ChartHandler, ChartProps } from './chart';
import { getOptions } from './utils';
import { SaveImageIconButton } from './saveImageIconButton';

export const CardChart = ({
  cardProps,
  ...rest
}: ChartProps & { cardProps?: CardProps; filename?: string }) => {
  const ref = React.useRef<ChartHandler>({ getInstance: () => undefined });
  const { extra, ...cardRestProps } = cardProps || {};
  const { options, filename, ...chartRest } = rest;
  const chartOptions = getOptions(options!);
  return (
    <Card
      {...cardRestProps}
      extra={
        <Space
          size={4}
          split={
            extra && (
              <Divider
                key='separation'
                type='vertical'
                style={{ marginInline: 4, borderColor: '#d3d3d3' }}
              />
            )
          }
        >
          {extra}
          <SaveImageIconButton chartHandler={ref.current} filename={filename} />
        </Space>
      }
    >
      <Chart {...chartRest} options={chartOptions} ref={ref} />
    </Card>
  );
};
