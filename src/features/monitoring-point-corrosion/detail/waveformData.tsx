import * as React from 'react';
import { Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { Metadata, PropertyLightSelectFilter } from '../../../asset-common';
import { getValue } from '../../../utils/format';
import { Card, Descriptions, Grid, LineChart } from '../../../components';

export interface ThicknessWaveData {
  metadata: Metadata;
  tof: number[];
  mv: number[];
}

export function WaveformData<T extends ThicknessWaveData>(props: { values: T }) {
  const { values } = props;
  const fields = [{ label: intl.get('amplitude'), value: 'mv', unit: 'mv', precision: 2 }];
  const metaData = [
    { label: 'FIELD_THICKNESS', value: 'thickness', unit: 'mm', precision: 3 },
    { label: 'FIELD_TEMPERATURE', value: 'temp', unit: '℃', precision: 1 },
    { label: 'FIELD_TOF', value: 'tof', unit: 'ns', precision: 0 },
    { label: 'rod.top.temperature', value: 'envTemp', unit: '℃', precision: 1 },
    { label: 'FIELD_SIGNAL_STRENGTH', value: 'sigStrength', unit: '', precision: 1 }
  ];
  const [field, setField] = React.useState(fields[0]);

  const renderMeta = () => {
    return (
      <Card>
        <Descriptions
          bordered={true}
          column={{ xxl: 3, xl: 2, lg: 2, md: 2, xs: 1 }}
          items={metaData.map(({ label, value, unit, precision }) => ({
            label: intl.get(label),
            children: getMetaProperty(values.metadata, value, unit, precision)
          }))}
        />
      </Card>
    );
  };

  const getMetaProperty = (meta: Metadata, metaValue: string, unit: string, precision: number) => {
    return getValue({ value: meta[metaValue], unit, precision });
  };

  const calculatePadding = (data: number[]) => {
    const origin = 7;
    const paddingLeft = 2;
    const paddingRight = 1;
    const paddingLeftLength = Math.floor((paddingLeft * data.length) / origin);
    const paddingRightLength = Math.floor((paddingRight * data.length) / origin);
    const interval =
      ((Math.max(...data) - Math.min(...data)) / data.length) *
      (origin / (origin + paddingLeft + paddingRight));
    const paddingLefts = Array(paddingLeftLength)
      .fill(data[0])
      .map((n, i) => n - (i + 1) * interval)
      .reverse();
    const paddingRights = Array(paddingRightLength)
      .fill(data[data.length - 1])
      .map((n, i) => n + (i + 1) * interval);
    return [paddingLefts, paddingRights];
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
    const [paddingLefts, paddingRights] = calculatePadding(tofs);

    return (
      <Card
      // extra={
      //   <PropertyLightSelectFilter
      //     onChange={(value) => {
      //       const field = fields.find((f) => f.value === value);
      //       if (field) {
      //         setField(field);
      //       }
      //     }}
      //     properties={fields.map(({ label, value }) => ({ name: label, key: value }))}
      //     value={field.value}
      //   />
      // }
      >
        <LineChart
          series={[
            {
              data: {
                [field.label]: [
                  ...Array(paddingLefts.length).fill(0),
                  ...values['mv'],
                  ...Array(paddingRights.length).fill(0)
                ]
              },
              xAxisValues: [...paddingLefts, ...tofs, ...paddingRights].map((value) =>
                getValue({ value })
              ),
              raw: { smooth: true }
            }
          ]}
          style={{ height: 600 }}
          config={{
            opts: {
              xAxis: { name: 'ns' },
              // dataZoom: isContained ? [{ startValue, endValue }] : [{ start: 70, end: 100 }]
              yAxis: { name: field.unit },
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 60, bottom: 60, right: 40 }
            }
          }}
          yAxisMeta={field}
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
