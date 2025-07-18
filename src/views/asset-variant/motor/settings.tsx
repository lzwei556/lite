import React from 'react';
import { Col, ColProps, Input, InputNumber, Radio, Select, Typography } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../components/formInputItem';
import { Card, Grid } from '../../../components';
import { generateColProps } from '../../../utils/grid';

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
          <FormInputItem label={intl.get('motor.motor_type')} name={['attributes', 'motor_type']}>
            <Select
              options={[
                {
                  label: 'AC',
                  value: 'AC'
                },
                {
                  label: 'DC',
                  value: 'DC'
                }
              ]}
            />
          </FormInputItem>
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.rotation_speed')}
            name={['attributes', 'rotation_speed']}
            numericRule={{
              message: intl.get('PLEASE_ENTER_NUMERIC')
            }}
            numericChildren={
              <InputNumber style={{ width: '100%' }} controls={false} addonAfter='RPM' min={1000} />
            }
          />
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={
              <Typography.Text ellipsis title={intl.get('motor.variable_frequency_drive')}>
                {intl.get('motor.variable_frequency_drive')}
              </Typography.Text>
            }
            name={['attributes', 'variable_frequency_drive']}
          >
            <Radio.Group
              options={[
                { label: intl.get('yes'), value: true },
                { label: intl.get('no'), value: false }
              ]}
            />
          </FormInputItem>
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.nominal_power')}
            name={['attributes', 'nominal_power']}
            numericRule={{
              message: intl.get('PLEASE_ENTER_NUMERIC')
            }}
            numericChildren={
              <InputNumber style={{ width: '100%' }} controls={false} addonAfter='kW' />
            }
          />
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem label={intl.get('motor.mounting')} name={['attributes', 'mounting']}>
            <Select
              options={[
                {
                  label: intl.get('horizontal'),
                  value: 1
                },
                {
                  label: intl.get('vertical'),
                  value: 2
                }
              ]}
            />
          </FormInputItem>
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.bearing_type')}
            name={['attributes', 'bearing_type']}
          >
            <Select
              options={[
                {
                  label: intl.get('motor.bearing.type.roller'),
                  value: 1
                },
                {
                  label: intl.get('motor.bearing.type.journal'),
                  value: 2
                }
              ]}
            />
          </FormInputItem>
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.bearing_model')}
            name={['attributes', 'bearing_model']}
          >
            <Input />
          </FormInputItem>
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.rolling.elements.num')}
            name={['attributes', 'rolling_elements_num']}
            numericRule={{
              message: intl.get('PLEASE_ENTER_NUMERIC')
            }}
            numericChildren={<InputNumber style={{ width: '100%' }} min={1} />}
          />
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.rolling.elements.diameter')}
            name={['attributes', 'rolling_elements_diameter']}
            numericRule={{
              message: intl.get('PLEASE_ENTER_NUMERIC')
            }}
            numericChildren={<InputNumber style={{ width: '100%' }} min={1} addonAfter='mm' />}
          />
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.pitch.circle.diameter')}
            name={['attributes', 'pitch_circle_diameter']}
            numericRule={{
              message: intl.get('PLEASE_ENTER_NUMERIC')
            }}
            numericChildren={<InputNumber style={{ width: '100%' }} min={1} addonAfter='mm' />}
          />
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.contact.angle')}
            name={['attributes', 'contact_angle']}
            numericRule={{
              message: intl.get('PLEASE_ENTER_NUMERIC')
            }}
            numericChildren={<InputNumber style={{ width: '100%' }} min={1} addonAfter='°' />}
          />
        </Col>
        <Col {...formItemColProps}>
          <FormInputItem
            label={intl.get('motor.rotation.mode')}
            name={['attributes', 'rotation_mode']}
          >
            <Select
              options={[
                {
                  label: intl.get('inner'),
                  value: 'inner'
                },
                {
                  label: intl.get('outer'),
                  value: 'outer'
                }
              ]}
            />
          </FormInputItem>
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
