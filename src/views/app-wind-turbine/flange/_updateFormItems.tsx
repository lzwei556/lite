import React from 'react';
import { Col, ColProps, Switch } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../utils/grid';
import {
  Grid,
  NumberFormItem,
  NumberFormItemWithSwitcher,
  SelectFormItem,
  TextFormItem
} from '../../../components';
import { SAMPLING_OFFSET, SAMPLING_PERIOD_2 } from '../../../constants';
import { AlarmLevel } from '../../alarm';
import { AssetRow, useContext } from '../../asset-common';
import { useParentTypes } from '../utils';
import { flange, wind } from '../constants';
import { categories, isFlangePreloadCalculation } from './common';

export const UpdateFormItems = ({
  asset,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  asset: AssetRow;
  formItemColProps?: ColProps;
}) => {
  const { assets } = useContext();
  const [isFlangePreload, setIsFlangePreload] = React.useState(isFlangePreloadCalculation(asset));
  const { label } = wind;
  const { type } = flange;
  const parentTypes = useParentTypes(type);
  const winds = assets.filter((a) => parentTypes.map(({ type }) => type).includes(a.type));

  return (
    <Grid>
      <Col {...formItemColProps}>
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
        <TextFormItem name='type' hidden={true} />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label={label}
          name='parent_id'
          rules={[{ required: true }]}
          selectProps={{ options: winds.map(({ id, name }) => ({ label: name, value: id })) }}
        />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='FLANGE_TYPE'
          name={['attributes', 'type']}
          rules={[{ required: true }]}
          selectProps={{
            options: categories.map(({ value, label }) => ({ label: intl.get(label), value }))
          }}
        />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='INDEX_NUMBER'
          name={['attributes', 'index']}
          selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher label='RATING' name={['attributes', 'normal']} />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher label='INITIAL_VALUE' name={['attributes', 'initial']} />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label={`leveled.alarm.${AlarmLevel.Minor}`}
          name={['attributes', 'info']}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label={`leveled.alarm.${AlarmLevel.Major}`}
          name={['attributes', 'warn']}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label={`leveled.alarm.${AlarmLevel.Critical}`}
          name={['attributes', 'danger']}
        />
      </Col>
      <Col {...formItemColProps}>
        <TextFormItem
          label='CALCULATE_FLANGE_PRELOAD'
          name={['attributes', 'sub_type']}
          valuePropName='checked'
        >
          <Switch onChange={setIsFlangePreload} />
        </TextFormItem>
      </Col>
      {isFlangePreload && (
        <>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='NUMBER_OF_BOLT'
              name={['attributes', 'monitoring_points_num']}
              rules={[{ required: true }]}
              inputNumberProps={{ min: 1 }}
            />
          </Col>
          <Col {...formItemColProps}>
            <SelectFormItem
              label='SAMPLING_PERIOD'
              name={['attributes', 'sample_period']}
              rules={[{ required: true }]}
              selectProps={{
                options: SAMPLING_PERIOD_2.map(({ text, value }) => ({
                  label: intl.get(text),
                  value
                }))
              }}
            />
          </Col>
          <Col {...formItemColProps}>
            <SelectFormItem
              label='SAMPLING_OFFSET'
              name={['attributes', 'sample_time_offset']}
              rules={[{ required: true }]}
              selectProps={{
                options: SAMPLING_OFFSET.map(({ text, value }) => ({
                  label: intl.get(text),
                  value
                }))
              }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='INITIAL_PRELOAD'
              name={['attributes', 'initial_preload']}
              rules={[{ required: true }]}
              inputNumberProps={{ addonAfter: 'kN' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='INITIAL_PRESSURE'
              name={['attributes', 'initial_pressure']}
              rules={[{ required: true }]}
              inputNumberProps={{ addonAfter: 'MPa' }}
            />
          </Col>
        </>
      )}
    </Grid>
  );
};
