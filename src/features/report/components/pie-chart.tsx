import React from 'react';
import { useGlobalStyles } from '../../../styles';
import { Card, Chart, getOptions, useBarPieOptions } from '../../../components';

export const PieChart = ({
  statistics
}: {
  statistics: { title: string; value: number; color: string }[];
}) => {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  const commonOptions = useBarPieOptions();
  const options = getOptions(commonOptions, {
    title: {
      left: 'center',
      top: 16,
      text: '分布图'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      bottom: 16
    },
    dataset: {
      source: {
        item: statistics.map(({ title }) => title),
        data: statistics.map(({ value }) => value)
      }
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        label: {
          show: true,
          formatter: '{c}({d}%)',
          ...colorTextDescriptionStyle
        }
      }
    ],
    color: statistics.map(({ color }) => color)
  });

  return (
    <Card
      className='chart'
      style={{ border: 0, marginBottom: 16 }}
      styles={{ body: { padding: 0 } }}
    >
      <Chart options={options} />
    </Card>
  );
};
