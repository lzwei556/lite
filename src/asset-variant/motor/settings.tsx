import React from 'react';
import { Col, ColProps, Radio } from 'antd';
import intl from 'react-intl-universal';
import {
  Card,
  CardProps,
  Grid,
  NumberFormItem,
  SelectFormItem,
  TextFormItem
} from '../../components';
import { generateColProps } from '../../utils/grid';
import { Field } from '../../types';

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

type MotorAttrsField = Field<MotorAttrs>;

export const MotorType: MotorAttrsField = {
  name: 'motor_type',
  label: 'motor.type',
  description: 'motor.type.desc',
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
};
export const RotationSpeed: MotorAttrsField = {
  name: 'rotation_speed',
  label: 'rotation.speed',
  description: 'rotation.speed.desc',
  unit: 'rpm'
};
export const VariableFrequencyDrive: MotorAttrsField = {
  name: 'variable_frequency_drive',
  label: 'variable.frequency.drive',
  description: 'variable.frequency.drive.desc',
  options: [
    //@ts-ignore
    { label: 'yes', value: true },
    //@ts-ignore
    { label: 'no', value: false }
  ]
};
export const NominalPower: MotorAttrsField = {
  name: 'nominal_power',
  label: 'nominal.power',
  description: 'nominal.power.desc',
  unit: 'kW'
};
export const Mounting: MotorAttrsField = {
  name: 'mounting',
  label: 'mounting',
  description: 'mounting.desc',
  options: [
    {
      label: 'horizontal',
      value: 1
    },
    {
      label: 'vertical',
      value: 2
    }
  ]
};
export const BearingType: MotorAttrsField = {
  name: 'bearing_type',
  label: 'bearing.type',
  description: 'bearing.type.desc',
  options: [
    {
      label: 'bearing.type.roller',
      value: 1
    },
    {
      label: 'bearing.type.journal',
      value: 2
    }
  ]
};
export const BearingModel: MotorAttrsField = {
  name: 'bearing_model',
  label: 'bearing.model',
  description: 'bearing.model.desc'
};

export const Settings = ({
  cardProps,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  cardProps?: CardProps;
  formItemColProps?: ColProps;
}) => {
  return (
    <Card {...cardProps} size='small' title={intl.get('motor.property')}>
      <Grid>
        <Col {...formItemColProps}>
          <SelectFormItem
            label={MotorType.label}
            name={['attributes', MotorType.name]}
            selectProps={{ options: MotorType.options }}
          />
        </Col>
        <Col {...formItemColProps}>
          <NumberFormItem
            label={RotationSpeed.label}
            name={['attributes', RotationSpeed.name]}
            inputNumberProps={{ addonAfter: RotationSpeed.unit, min: 1000 }}
          />
        </Col>
        <Col {...formItemColProps}>
          <TextFormItem
            label={VariableFrequencyDrive.label}
            name={['attributes', VariableFrequencyDrive.name]}
          >
            <Radio.Group
              options={VariableFrequencyDrive.options?.map((opt) => ({
                ...opt,
                label: intl.get(opt.label)
              }))}
            />
          </TextFormItem>
        </Col>
        <Col {...formItemColProps}>
          <NumberFormItem
            label={NominalPower.label}
            name={['attributes', NominalPower.name]}
            inputNumberProps={{ addonAfter: NominalPower.unit }}
          />
        </Col>
        <Col {...formItemColProps}>
          <SelectFormItem
            label={Mounting.label}
            name={['attributes', Mounting.name]}
            selectProps={{
              options: Mounting.options?.map((opt) => ({
                ...opt,
                label: intl.get(opt.label)
              }))
            }}
          />
        </Col>
        <Col {...formItemColProps}>
          <SelectFormItem
            label={BearingType.label}
            name={['attributes', BearingType.name]}
            selectProps={{
              options: BearingType.options?.map((opt) => ({
                ...opt,
                label: intl.get(opt.label)
              }))
            }}
          />
        </Col>
        <Col {...formItemColProps}>
          <TextFormItem label={BearingModel.label} name={['attributes', BearingModel.name]} />
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
