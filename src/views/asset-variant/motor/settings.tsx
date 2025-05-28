import React from 'react';
import { Input, InputNumber, Radio, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../components/formInputItem';

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

export const Settings = () => {
  return (
    <fieldset>
      <legend>
        {intl.get('VIBRATION_MOTOR')}
        {intl.get('PROPERTY')}
      </legend>
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
      <FormInputItem
        label={intl.get('motor.variable_frequency_drive')}
        name={['attributes', 'variable_frequency_drive']}
      >
        <Radio.Group
          options={[
            { label: '是', value: true },
            { label: '否', value: false }
          ]}
        />
      </FormInputItem>
      <FormInputItem
        label={intl.get('motor.nominal_power')}
        name={['attributes', 'nominal_power']}
        numericRule={{
          message: intl.get('PLEASE_ENTER_NUMERIC')
        }}
        numericChildren={<InputNumber style={{ width: '100%' }} controls={false} addonAfter='kW' />}
      />
      <FormInputItem label={intl.get('motor.mounting')} name={['attributes', 'mounting']}>
        <Select
          options={[
            {
              label: '水平',
              value: 1
            },
            {
              label: '垂直',
              value: 2
            }
          ]}
        />
      </FormInputItem>
      <FormInputItem label={intl.get('motor.bearing_type')} name={['attributes', 'bearing_type']}>
        <Select
          options={[
            {
              label: '滚动轴承',
              value: 1
            },
            {
              label: '滑动轴承',
              value: 2
            }
          ]}
        />
      </FormInputItem>
      <FormInputItem label={intl.get('motor.bearing_model')} name={['attributes', 'bearing_model']}>
        <Input />
      </FormInputItem>
      <FormInputItem
        label={intl.get('motor.rolling.elements.num')}
        name={['attributes', 'rolling_elements_num']}
        numericRule={{
          message: intl.get('PLEASE_ENTER_NUMERIC')
        }}
        numericChildren={<InputNumber style={{ width: '100%' }} min={1} />}
      />
      <FormInputItem
        label={intl.get('motor.rolling.elements.diameter')}
        name={['attributes', 'rolling_elements_diameter']}
        numericRule={{
          message: intl.get('PLEASE_ENTER_NUMERIC')
        }}
        numericChildren={<InputNumber style={{ width: '100%' }} min={1} addonAfter='mm' />}
      />
      <FormInputItem
        label={intl.get('motor.pitch.circle.diameter')}
        name={['attributes', 'pitch_circle_diameter']}
        numericRule={{
          message: intl.get('PLEASE_ENTER_NUMERIC')
        }}
        numericChildren={<InputNumber style={{ width: '100%' }} min={1} addonAfter='mm' />}
      />
      <FormInputItem
        label={intl.get('motor.contact.angle')}
        name={['attributes', 'contact_angle']}
        numericRule={{
          message: intl.get('PLEASE_ENTER_NUMERIC')
        }}
        numericChildren={<InputNumber style={{ width: '100%' }} min={1} addonAfter='°' />}
      />
      <FormInputItem label={intl.get('motor.rotation.mode')} name={['attributes', 'rotation_mode']}>
        <Select
          options={[
            {
              label: '内',
              value: 'inner'
            },
            {
              label: '外',
              value: 'outer'
            }
          ]}
        />
      </FormInputItem>
    </fieldset>
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
