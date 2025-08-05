import React from 'react';
import { Checkbox, Select, Space } from 'antd';
import intl from 'react-intl-universal';
import { Card, LineChart } from '../../../components';
import { AXIS_OPTIONS, DynamicData, PropertyLightSelectFilter } from '../../../asset-common';

type Field = { label: string; value: string; unit: string; precision: number };

const fields: Field[] = [
  {
    label: 'FIELD_ORIGINAL_DOMAIN',
    value: 'originalDomain',
    unit: '',
    precision: 1
  },
  {
    label: 'FIELD_ACCELERATION_TIME_DOMAIN',
    value: 'accelerationTimeDomain',
    unit: 'm/s²',
    precision: 1
  },
  {
    label: 'FIELD_ACCELERATION_FREQUENCY_DOMAIN',
    value: 'accelerationFrequencyDomain',
    unit: 'm/s²',
    precision: 3
  },
  {
    label: 'FIELD_VELOCITY_TIME_DOMAIN',
    value: 'velocityTimeDomain',
    unit: '',
    precision: 1
  },
  {
    label: 'FIELD_VELOCITY_FREQUENCY_DOMAIN',
    value: 'velocityFrequencyDomain',
    unit: '',
    precision: 3
  },
  {
    label: 'FIELD_DISPLACEMENT_TIME_DOMAIN',
    value: 'displacementTimeDomain',
    unit: '',
    precision: 1
  },
  {
    label: 'FIELD_DISPLACEMENT_FREQUENCY_DOMAIN',
    value: 'displacementFrequencyDomain',
    unit: '',
    precision: 3
  }
];

type Data = {
  frequency: number;
  highEnvelopes: number[];
  lowEnvelopes: number[];
  values: number[];
  xAxis: number[];
  xAxisUnit: string;
  yAxisUnit: string;
};

export function WaveformData(props: { id: number }) {
  const { id } = props;
  const [field, setField] = React.useState(fields[0]);
  const [axis, setAxis] = React.useState(0);

  return (
    <DynamicData<Data>
      children={(values) => (
        <Content {...{ values, axis, field, onAxisChange: setAxis, onFieldChange: setField }} />
      )}
      dataType='raw'
      filters={{ axis, field: field.value }}
      id={id}
    />
  );
}

const Content = <T extends Data>(props: {
  axis: number;
  field: Field;
  onAxisChange: (axis: number) => void;
  onFieldChange: (field: Field) => void;
  values: T;
}) => {
  const { axis, field } = props;
  const [isShowEnvelope, setIsShowEnvelope] = React.useState(false);

  function renderChart() {
    const { frequency, values, xAxis, xAxisUnit, yAxisUnit, highEnvelopes, lowEnvelopes } =
      props.values;
    let series: any = [];
    if (!!values && !!xAxis) {
      series.push({
        data: { [AXIS_OPTIONS.map(({ label }) => intl.get(label))[axis]]: values },
        xAxisValues: xAxis.map((n) => `${n}`),
        raw: {
          smooth: true
        }
      });
      if (isShowEnvelope) {
        series.push({
          data: { [AXIS_OPTIONS.map(({ label }) => intl.get(label))[axis]]: highEnvelopes },
          xAxisValues: xAxis.map((n) => `${n}`),
          raw: {
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              color: '#ccc'
            },
            stack: 'confidence-band',
            smooth: true
          }
        });
        series.push({
          data: { [AXIS_OPTIONS.map(({ label }) => intl.get(label))[axis]]: lowEnvelopes },
          xAxisValues: xAxis.map((n) => `${n}`),
          raw: {
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              color: '#ccc'
            },
            stack: 'confidence-band',
            smooth: true
          }
        });
      }
    }
    return (
      <LineChart
        series={series}
        style={{ height: 600 }}
        config={{
          opts: {
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
        }}
        yAxisMeta={{
          interval: 0,
          precision: field.precision,
          unit: field.unit.length > 0 ? field.unit : yAxisUnit
        }}
      />
    );
  }

  return (
    <Card
      extra={
        <Space>
          <PropertyLightSelectFilter
            onChange={(value) => {
              const field = fields.find((f) => f.value === value);
              if (field) {
                props.onFieldChange(field);
              }
            }}
            properties={fields.map(({ label, value }) => ({ name: label, key: value }))}
            value={field.value}
          />
          <Select
            onChange={(val) => {
              props.onAxisChange(val);
            }}
            options={AXIS_OPTIONS.map(({ label, value }) => ({ label: intl.get(label), value }))}
            popupMatchSelectWidth={false}
            value={axis}
          />
          {field.value.indexOf('TimeDomain') !== -1 && (
            <Checkbox
              defaultChecked={isShowEnvelope}
              onChange={(e) => {
                setIsShowEnvelope(e.target.checked);
              }}
            >
              {intl.get('SHOW_ENVELOPE')}
            </Checkbox>
          )}
        </Space>
      }
      title={field.label ? intl.get(field.label) : undefined}
    >
      {renderChart()}
    </Card>
  );
};
