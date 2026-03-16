import React from 'react';
import { Col, ColProps, Switch } from 'antd';
import { Translation } from 'locales/utils';
import { generateColProps } from '../../../utils/grid';
import {
  Grid,
  NumberFormItem,
  NumberFormItemWithSwitcher,
  SelectFormItem,
  TextFormItem
} from '../../../components';
import { SAMPLING_OFFSET, SAMPLING_PERIOD_2 } from '../../../constants';
import { AlarmLevel, getLabelByValue } from '../../alarm';
import { AssetRow, useContext } from '../../../asset-common';
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
        <TextFormItem
          label='common.name'
          name='name'
          rules={[{ required: true }, { min: 4, max: 50 }]}
        />
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
          label='asset.flange.type'
          name={['attributes', 'type']}
          rules={[{ required: true }]}
          selectProps={{
            options: categories.map(({ value, label }) => ({
              label: Translation.get(label),
              value
            }))
          }}
        />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='common.index'
          name={['attributes', 'index']}
          selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label='asset.flange.rating'
          name={['attributes', 'normal']}
          nameMode='mixed'
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label='asset.flange.initial'
          name={['attributes', 'initial']}
          nameMode='mixed'
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label={Translation.leveledAlarm(getLabelByValue(AlarmLevel.Minor))}
          name={['attributes', 'info']}
          nameMode='mixed'
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label={Translation.leveledAlarm(getLabelByValue(AlarmLevel.Major))}
          name={['attributes', 'warn']}
          nameMode='mixed'
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label={Translation.leveledAlarm(getLabelByValue(AlarmLevel.Critical))}
          name={['attributes', 'danger']}
          nameMode='mixed'
        />
      </Col>
      <Col {...formItemColProps}>
        <TextFormItem
          label='asset.flange.calculation.enabled'
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
              label='asset.flange.numbers.of.bolt'
              name={['attributes', 'monitoring_points_num']}
              rules={[{ required: true }]}
              inputNumberProps={{ min: 1 }}
            />
          </Col>
          <Col {...formItemColProps}>
            <SelectFormItem
              label='asset.flange.sampling.period'
              name={['attributes', 'sample_period']}
              rules={[{ required: true }]}
              selectProps={{
                options: SAMPLING_PERIOD_2.map(({ label, value }) => ({
                  label: Translation.get(...label),
                  value
                }))
              }}
            />
          </Col>
          <Col {...formItemColProps}>
            <SelectFormItem
              label='asset.flange.sampling.offset'
              name={['attributes', 'sample_time_offset']}
              rules={[{ required: true }]}
              selectProps={{
                options: SAMPLING_OFFSET.map(({ label, value }) => ({
                  label: Translation.get(...label),
                  value
                }))
              }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='asset.flange.initial.preload'
              name={['attributes', 'initial_preload']}
              rules={[{ required: true }]}
              inputNumberProps={{ addonAfter: 'kN' }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItem
              label='asset.flange.initial.stress'
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
