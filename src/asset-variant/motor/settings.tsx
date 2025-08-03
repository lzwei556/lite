import React from 'react';
import { Col, ColProps, Radio } from 'antd';
import intl from 'react-intl-universal';
import { Card, Grid, NumberFormItem, SelectFormItem, TextFormItem } from '../../components';
import { generateColProps } from '../../utils/grid';

export type MotorAttrs = {
  motor_type: 'AC' | 'DC';
  rotation_speed: number;
  variable_frequency_drive: boolean;
  nominal_power: number;
  mounting: 1 | 2;
  bearing_type: 1 | 2;
  bearing_model: string;
  rolling_elements_num: number;
  rolling_elements_diameter: number;
  pitch_circle_diameter: number;
  contact_angle: number;
  rotation_mode: 'inner' | 'outer';
};

export const Settings = ({
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  formItemColProps?: ColProps;
}) => {
  return (
    <Card size='small' title={intl.get('motor.property')}>
      <Grid>
        <Col {...formItemColProps}>
          <SelectFormItem
            label='motor.motor_type'
            name={['attributes', 'motor_type']}
            selectProps={{
              options: [
                {
                  label: 'AC',
                  value: 'AC'
                },
                {
                  label: 'DC',
                  value: 'DC'
                }
              ]
            }}
          />
        </Col>
        <Col {...formItemColProps}>
          <NumberFormItem
            label='motor.rotation_speed'
            name={['attributes', 'rotation_speed']}
            inputNumberProps={{ addonAfter: 'RMP', min: 1000 }}
          />
        </Col>
        <Col {...formItemColProps}>
          <TextFormItem
            label='motor.variable_frequency_drive'
            name={['attributes', 'variable_frequency_drive']}
          >
            <Radio.Group
              options={[
                { label: intl.get('yes'), value: true },
                { label: intl.get('no'), value: false }
              ]}
            />
          </TextFormItem>
        </Col>
        <Col {...formItemColProps}>
          <NumberFormItem
            label='motor.nominal_power'
            name={['attributes', 'nominal_power']}
            inputNumberProps={{ addonAfter: 'kW' }}
          />
        </Col>
        <Col {...formItemColProps}>
          <SelectFormItem
            label='motor.mounting'
            name={['attributes', 'mounting']}
            selectProps={{
              options: [
                {
                  label: intl.get('horizontal'),
                  value: 1
                },
                {
                  label: intl.get('vertical'),
                  value: 2
                }
              ]
            }}
          />
        </Col>
        <Col {...formItemColProps}>
          <SelectFormItem
            label='motor.bearing_type'
            name={['attributes', 'bearing_type']}
            selectProps={{
              options: [
                {
                  label: intl.get('motor.bearing.type.roller'),
                  value: 1
                },
                {
                  label: intl.get('motor.bearing.type.journal'),
                  value: 2
                }
              ]
            }}
          />
        </Col>
        <Col {...formItemColProps}>
          <TextFormItem label='motor.bearing_model' name={['attributes', 'bearing_model']} />
        </Col>
        <Col {...formItemColProps}>
          <NumberFormItem
            label='motor.rolling.elements.num'
            name={['attributes', 'rolling_elements_num']}
            inputNumberProps={{ min: 1 }}
          />
        </Col>
        <Col {...formItemColProps}>
          <NumberFormItem
            label='motor.rolling.elements.diameter'
            name={['attributes', 'rolling_elements_diameter']}
            inputNumberProps={{ addonAfter: 'mm', min: 1 }}
          />
        </Col>
        <Col {...formItemColProps}>
          <NumberFormItem
            label='motor.pitch.circle.diameter'
            name={['attributes', 'pitch_circle_diameter']}
            inputNumberProps={{ addonAfter: 'mm', min: 1 }}
          />
        </Col>
        <Col {...formItemColProps}>
          <NumberFormItem
            label='motor.contact.angle'
            name={['attributes', 'contact_angle']}
            inputNumberProps={{ addonAfter: '°', min: 1 }}
          />
        </Col>
        <Col {...formItemColProps}>
          <SelectFormItem
            label='motor.rotation.mode'
            name={['attributes', 'rotation_mode']}
            selectProps={{
              options: [
                {
                  label: intl.get('inner'),
                  value: 'inner'
                },
                {
                  label: intl.get('outer'),
                  value: 'outer'
                }
              ]
            }}
          />
        </Col>
      </Grid>
    </Card>
  );
};

export const defaultSettings = {
  attributes: {
    motor_type: 'AC',
    rotation_speed: 1000,
    variable_frequency_drive: true,
    nominal_power: 380,
    mounting: 1,
    bearing_type: 1,
    bearing_model: '',
    rolling_elements_num: 10,
    rolling_elements_diameter: 100,
    pitch_circle_diameter: 100,
    contact_angle: 2,
    rotation_mode: 'inner'
  } as MotorAttrs
};
