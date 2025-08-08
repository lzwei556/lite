import * as React from 'react';
import { Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { getValue, roundValue } from '../../../../utils/format';
import { generateColProps } from '../../../../utils/grid';
import { Card, Descriptions, Grid, LineChart } from '../../../../components';
import { Metadata, MonitoringPointRow, PropertyLightSelectFilter } from '../../../../asset-common';
import * as Tower from '../../../asset-wind-turbine/tower';
import { AngleDynamicData } from './types';

const fields = [
  {
    label: 'FIELD_DISPLACEMENT_RADIAL2',
    value: 'dynamic_displacement_radial',
    unit: 'mm',
    precision: 2
  },
  {
    label: 'FIELD_DISPLACEMENT_EW2',
    value: 'dynamic_displacement_ew',
    unit: 'mm',
    precision: 2
  },
  {
    label: 'FIELD_DISPLACEMENT_NS2',
    value: 'dynamic_displacement_ns',
    unit: 'mm',
    precision: 2
  },
  {
    label: 'FIELD_INCLINATION_RADIAL2',
    value: 'dynamic_inclination_radial',
    unit: '°',
    precision: 2
  },
  { label: 'FIELD_INCLINATION_EW2', value: 'dynamic_inclination_ew', unit: '°', precision: 2 },
  { label: 'FIELD_INCLINATION_NS2', value: 'dynamic_inclination_ns', unit: '°', precision: 2 },
  { label: 'FIELD_DIRECTION', value: 'dynamic_direction', unit: '°', precision: 2 },
  { label: 'FIELD_WAGGLE', value: 'dynamic_waggle', unit: 'g', precision: 2 }
];
const metaData = [
  { label: 'FIELD_INCLINATION', value: 'mean_inclination', unit: '°', precision: 2 },
  { label: 'FIELD_PITCH', value: 'mean_pitch', unit: '°', precision: 2 },
  { label: 'FIELD_ROLL', value: 'mean_roll', unit: '°', precision: 2 },
  { label: 'FIELD_WAGGLE', value: 'mean_waggle', unit: 'g', precision: 2 },
  { label: 'FIELD_TEMPERATURE', value: 'temperature', unit: '℃', precision: 1 }
];

export function Angle<T extends AngleDynamicData>(props: {
  values: T;
  monitoringPoint: MonitoringPointRow;
}) {
  const { values, monitoringPoint } = props;
  const [field, setField] = React.useState(fields[0]);
  const { attributes, name, type } = monitoringPoint;
  const displacements = values['dynamic_displacement_radial'];
  const angles = displacements.map((d, i) => [
    roundValue(d, 2),
    roundValue(values['dynamic_direction'][i] as number, 2)
  ]);
  const renderMeta = () => {
    return (
      <Descriptions
        bordered={true}
        column={{ xxl: 2, xl: 2, lg: 1, md: 1, xs: 1 }}
        items={metaData.map(({ label, value, unit, precision }) => ({
          label: intl.get(label),
          children: getMetaProperty(values.metadata, value, unit, precision)
        }))}
      />
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
    const data = values[field.value as keyof Omit<AngleDynamicData, 'metadata'>];
    return (
      <LineChart
        series={[
          {
            data: { [intl.get(field.label)]: data },
            xAxisValues: data.map((n, i) => `${i}`)
          }
        ]}
        style={{ height: 470 }}
        yAxisMeta={{ unit: field.unit, precision: field.precision }}
      />
    );
  };

  return (
    <Grid>
      <Col {...generateColProps({ md: 24, lg: 24, xl: 10, xxl: 10 })}>
        <Tower.PointsScatterChart
          cardProps={{}}
          data={[]}
          dynamicData={[
            {
              name,
              data: angles,
              height: attributes?.tower_install_height,
              radius: attributes?.tower_base_radius
            }
          ]}
          type={type}
        />
      </Col>
      <Col {...generateColProps({ md: 24, lg: 24, xl: 14, xxl: 14 })}>
        <Grid>
          <Col span={24}>
            <Card>{renderMeta()}</Card>
          </Col>
          <Col span={24}>
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
              {renderChart()}
            </Card>
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
}
