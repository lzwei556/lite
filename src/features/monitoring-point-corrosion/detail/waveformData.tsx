import * as React from 'react';
import { Col, Empty } from 'antd';
import { Translation } from 'locales/utils';
import { Metadata } from '../../../asset-common';
import { getValue, roundValue } from '../../../utils/format';
import { Card, Descriptions, Grid, LineChart } from '../../../components';
import { findClosest } from '../../../utils';

export interface ThicknessWaveData {
  metadata: Metadata;
  tof: number[];
  mv: number[];
}

export function WaveformData<T extends ThicknessWaveData>(props: { values: T }) {
  const { values } = props;
  const fields = [
    { label: Translation.get('feature.amplitude'), value: 'mv', unit: 'mv', precision: 2 }
  ];
  const metaData = [
    { label: 'FIELD_THICKNESS', value: 'thickness', unit: 'mm', precision: 3 },
    { label: 'FIELD_TEMPERATURE', value: 'temp', unit: '℃', precision: 1 },
    { label: 'FIELD_TOF', value: 'tof', unit: 'ns', precision: 0 },
    { label: 'corrosion.rod-top.temperature', value: 'envTemp', unit: '℃', precision: 1 },
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
            label: Translation.get(label),
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

  const getTofMarkPointData = (tofs: number[]) => {
    const tof = values.metadata['tof'];
    const nearestTof = findClosest([...tofs], tof);
    if (nearestTof) {
      const tofIndex = tofs.indexOf(nearestTof);
      return [nearestTof, values.mv[tofIndex]];
    }
    return null;
  };

  const renderChart = () => {
    if (!values) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    const tofs = values['tof'];
    const [paddingLefts, paddingRights] = calculatePadding(tofs);
    const markPointData = getTofMarkPointData(tofs);

    return (
      <Card>
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
                roundValue(value)
              ),
              raw: markPointData
                ? {
                    markPoint: {
                      data: [
                        { name: 'tof', coord: markPointData, value: roundValue(markPointData[0]) }
                      ]
                    },
                    smooth: true
                  }
                : { smooth: true }
            }
          ]}
          style={{ height: 600 }}
          config={{
            opts: {
              xAxis: {
                name: 'ns',
                scale: true,
                type: 'value',
                axisPointer: { label: { precision: 3 } }
              },
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
