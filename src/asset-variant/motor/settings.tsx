import React from 'react';
import { Col, ColProps, Space } from 'antd';
import { Card, Grid, NumberFormItem, SliderFormItem, TextFormItem } from '../../components';
import { generateColProps } from '../../utils/grid';
import { Field } from '../../types';
import intl from 'react-intl-universal';

export type MotorAttrsDTO = {
  rotation_speed: number;
  rolling_elements_num: number;
  rolling_elements_diameter: number;
  pitch_circle_diameter: number;
  contact_angle: number;
  rotation_mode: 'inner' | 'outer';
  rpm: number;
  envBand: [min: number, max: number];
  powerFreq: number;
  gearTeeth: number;
  bearing: {
    nBalls: number;
    d: number;
    bigD: number;
    theta: number;
  };
  motor: {
    poles: number;
    slip: number;
  };
  velBase: {
    velBase1_10X: [
      base1: number,
      base2: number,
      base3: number,
      base4: number,
      base5: number,
      base6: number,
      base7: number,
      base8: number,
      base9: number,
      base10: number
    ];
    velNonIntBase0_10X: number;
    velBase10_40X: number;
    velBase40_99X: number;
    velBaseBearing: number;
    velBase100Hz: number;
    velBaseMFB: number;
  };
};

type MotorAttrsField = Field<MotorAttrsDTO>;

export const rotationSpeed: MotorAttrsField = {
  name: 'rpm',
  label: 'rotation.speed',
  description: 'rotation.speed.desc',
  unit: 'rpm',
  type: 'number'
};

export const envBand: MotorAttrsField = {
  name: 'envBand',
  label: 'env.band',
  description: 'env.band.desc',
  unit: 'Hz',
  type: 'number'
};

export const powerFreq: MotorAttrsField = {
  name: 'powerFreq',
  label: 'power.freq',
  description: 'power.freq.desc',
  unit: 'Hz',
  type: 'number'
};

export const gearTeeth: MotorAttrsField = {
  name: 'gearTeeth',
  label: 'gear.teeth',
  description: 'gear.teeth.desc',
  type: 'number'
};

export const MotorBasicSettings = ({
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  formItemColProps?: ColProps;
}) => {
  return (
    <>
      <Col {...formItemColProps}>
        <NumberFormItem
          label={rotationSpeed.label}
          name={['attributes', rotationSpeed.name]}
          inputNumberProps={{ addonAfter: rotationSpeed.unit }}
        />
      </Col>
      <Col {...formItemColProps}>
        <SliderFormItem
          label={envBand.label}
          name={['attributes', envBand.name]}
          sliderProps={{
            min: defaultSettings.attributes.envBand[0],
            max: defaultSettings.attributes.envBand[1],
            range: true,
            marks: {
              [defaultSettings.attributes.envBand[0]]: defaultSettings.attributes.envBand[0],
              [defaultSettings.attributes.envBand[1]]: defaultSettings.attributes.envBand[1]
            },
            styles: { root: { marginBottom: 0 } }
          }}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItem
          label={powerFreq.label}
          name={['attributes', powerFreq.name]}
          inputNumberProps={{ addonAfter: powerFreq.unit }}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItem label={gearTeeth.label} name={['attributes', gearTeeth.name]} />
      </Col>
    </>
  );
};

export const Settings = ({
  formItemColProps = generateColProps({ xl: 12, xxl: 12 }),
  velBaseFormItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  formItemColProps?: ColProps;
  velBaseFormItemColProps?: ColProps;
}) => {
  return (
    <>
      <Card
        size='small'
        style={{ marginBottom: 16 }}
        title={intl.get('bearing.parameters')}
        type='inner'
      >
        <Grid>
          <Col {...formItemColProps}>
            <NumberFormItem label='bearing.nBalls' name={['attributes', 'bearing', 'nBalls']} />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='bearing.d'
              name={['attributes', 'bearing', 'd']}
              inputNumberProps={{ addonAfter: 'm' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='bearing.bigD'
              name={['attributes', 'bearing', 'bigD']}
              inputNumberProps={{ addonAfter: 'm' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='bearing.theta'
              name={['attributes', 'bearing', 'theta']}
              inputNumberProps={{ addonAfter: 'rad' }}
            />
          </Col>
        </Grid>
      </Card>
      <Card
        size='small'
        style={{ marginBottom: 16 }}
        title={intl.get('motor.parameters')}
        type='inner'
      >
        <Grid>
          <Col {...formItemColProps}>
            <NumberFormItem label='motor.poles' name={['attributes', 'motor', 'poles']} />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem label='motor.slip' name={['attributes', 'motor', 'slip']} />
          </Col>
        </Grid>
      </Card>
      <Card
        size='small'
        style={{ marginBottom: 16 }}
        title={intl.get('velocity.parameters')}
        type='inner'
      >
        <Grid>
          <Col {...velBaseFormItemColProps}>
            <TextFormItem label='velBase.velBase1_10X'>
              <Space>
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 0]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 1]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 2]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 3]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 4]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 5]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 6]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 7]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 8]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
                <NumberFormItem
                  name={['attributes', 'velBase', 'velBase1_10X', 9]}
                  noStyle
                  inputNumberProps={{ controls: false }}
                />
              </Space>
            </TextFormItem>
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='velBase.velNonIntBase0_10X'
              name={['attributes', 'velBase', 'velNonIntBase0_10X']}
              inputNumberProps={{ addonAfter: 'dB' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='velBase.velBase10_40X'
              name={['attributes', 'velBase', 'velBase10_40X']}
              inputNumberProps={{ addonAfter: 'dB' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='velBase.velBase40_99X'
              name={['attributes', 'velBase', 'velBase40_99X']}
              inputNumberProps={{ addonAfter: 'dB' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='velBase.velBaseBearing'
              name={['attributes', 'velBase', 'velBaseBearing']}
              inputNumberProps={{ addonAfter: 'dB' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='velBase.velBase100Hz'
              name={['attributes', 'velBase', 'velBase100Hz']}
              inputNumberProps={{ addonAfter: 'dB' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='velBase.velBaseMFB'
              name={['attributes', 'velBase', 'velBaseMFB']}
              inputNumberProps={{ addonAfter: 'dB' }}
            />
          </Col>
        </Grid>
      </Card>
    </>
  );
};

export const defaultSettings = {
  attributes: {
    rotation_speed: 1000,
    rolling_elements_num: 10,
    rolling_elements_diameter: 100,
    pitch_circle_diameter: 100,
    contact_angle: 2,
    rotation_mode: 'inner',
    rpm: 1500,
    envBand: [100, 1000],
    powerFreq: 50,
    gearTeeth: 30,
    bearing: {
      nBalls: 8,
      d: 0.01,
      bigD: 0.05,
      theta: 0.5236
    },
    motor: {
      poles: 4,
      slip: 0.02
    },
    velBase: {
      velBase1_10X: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
      velNonIntBase0_10X: 25,
      velBase10_40X: 30,
      velBase40_99X: 35,
      velBaseBearing: 40,
      velBase100Hz: 45,
      velBaseMFB: 50
    }
  } as MotorAttrsDTO
};
