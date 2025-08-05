import * as React from 'react';
import { Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { Metadata, PropertyLightSelectFilter } from '../../../asset-common';
import { getValue, roundValue } from '../../../utils/format';
import { Card, Descriptions, Grid, LineChart } from '../../../components';

export interface ThicknessWaveData {
  metadata: Metadata;
  tof: number[];
  mv: number[];
}

const fields = [{ label: 'mV', value: 'mv', unit: '', precision: 2 }];
const metaData = [
  { label: 'FIELD_THICKNESS', value: 'thickness', unit: 'mm', precision: 3 },
  { label: 'FIELD_TEMPERATURE', value: 'temp', unit: '℃', precision: 1 },
  { label: 'FIELD_TOF', value: 'tof', unit: 'ns', precision: 0 },
  { label: 'rod.top.temperature', value: 'envTemp', unit: '℃', precision: 1 },
  { label: 'FIELD_SIGNAL_STRENGTH', value: 'sigStrength', unit: '', precision: 1 }
];

export function WaveformData<T extends ThicknessWaveData>(props: { values: T }) {
  const { values } = props;
  const [field, setField] = React.useState(fields[0]);

  const renderMeta = () => {
    return (
      <Card>
        <Descriptions
          bordered={true}
          column={{ xxl: 3, xl: 3, lg: 2, md: 2, xs: 1 }}
          items={metaData.map(({ label, value, unit, precision }) => ({
            label: intl.get(label),
            children: getMetaProperty(values.metadata, value, unit, precision)
          }))}
        />
      </Card>
    );
  };

  const getMetaProperty = (meta: Metadata, metaValue: string, unit: string, precision: number) => {
    if (!meta) return '-';
    return getValue(roundValue(meta[metaValue], precision), unit);
  };

  const renderChart = () => {
    if (!values) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    const tofs = values['tof'];
    const tof = values.metadata['tof'];
    const isContained =
      tof && !Number.isNaN(tof) && tof <= Math.max(...tofs) && tof >= Math.min(...tofs);
    const _tofs = Array.from(new Set([...tofs, tof].sort((prev, crt) => prev - crt)));
    const index = _tofs.indexOf(tof);

    let startValue = 0;
    let endValue = 100;
    if (isContained && index !== -1) {
      const percentage = (index / _tofs.length) * 100;
      const interval = { default: 10, medium: 15, large: 20, xLarge: 25 };
      let offsetRight = interval.default;
      let offsetLeft = interval.default;
      if (percentage <= 20) {
        offsetRight = interval.xLarge;
      } else if (percentage <= 30) {
        offsetRight = interval.large;
      } else if (percentage <= 40) {
        offsetRight = interval.medium;
      } else if (percentage >= 60) {
        offsetLeft = interval.medium;
      } else if (percentage >= 80) {
        offsetLeft = interval.large;
      }
      startValue = index - offsetLeft;
      endValue = index + offsetRight;
    }
    return (
      <Card
        extra={
          <PropertyLightSelectFilter
            onChange={(value) => {
              const field = fields.find((f) => f.value === value);
              if (field) {
                setField(field);
              }
            }}
            properties={fields.map(({ label, value }) => ({ name: label, key: value }))}
            value={field.value}
          />
        }
      >
        <LineChart
          series={[
            {
              data: { [field.label]: values['mv'] },
              xAxisValues: tofs.map((n) => `${n}`),
              raw: { smooth: true }
            }
          ]}
          style={{ height: 600 }}
          config={{
            opts: {
              xAxis: { name: 'ns' },
              // dataZoom: isContained ? [{ startValue, endValue }] : [{ start: 70, end: 100 }]
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 60, bottom: 60, right: 40 }
            }
          }}
          yAxisMeta={{ precision: field.precision }}
        />
      </Card>
    );
  };

  return (
    <Grid>
      <Col span={24}>{renderMeta()}</Col>
      <Col span={24}>{renderChart()}</Col>
    </Grid>
  );
}
