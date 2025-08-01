import React from 'react';
import { Checkbox } from 'antd';
import intl from 'react-intl-universal';
import {
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

export const UpdateFormItems = ({ asset }: { asset: AssetRow }) => {
  const { assets } = useContext();
  const [isFlangePreload, setIsFlangePreload] = React.useState(isFlangePreloadCalculation(asset));
  const { label } = wind;
  const { type } = flange;
  const parentTypes = useParentTypes(type);
  const winds = assets.filter((a) => parentTypes.map(({ type }) => type).includes(a.type));

  return (
    <>
      <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      <TextFormItem name='type' hidden={true} initialValue={type} />
      <SelectFormItem
        label={label}
        name='parent_id'
        rules={[{ required: true }]}
        selectProps={{ options: winds.map(({ id, name }) => ({ label: name, value: id })) }}
      />
      <SelectFormItem
        label='FLANGE_TYPE'
        name={['attributes', 'type']}
        rules={[{ required: true }]}
        selectProps={{
          options: categories.map(({ value, label }) => ({ label: intl.get(label), value }))
        }}
      />
      <SelectFormItem
        label='INDEX_NUMBER'
        name={['attributes', 'index']}
        initialValue={1}
        selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
      />
      <NumberFormItemWithSwitcher label='RATING' name={['attributes', 'normal']} />
      <NumberFormItemWithSwitcher label='INITIAL_VALUE' name={['attributes', 'initial']} />
      <NumberFormItemWithSwitcher
        label={`leveled.alarm.${AlarmLevel.Minor}`}
        name={['attributes', 'info']}
      />
      <NumberFormItemWithSwitcher
        label={`leveled.alarm.${AlarmLevel.Major}`}
        name={['attributes', 'warn']}
      />
      <NumberFormItemWithSwitcher
        label={`leveled.alarm.${AlarmLevel.Critical}`}
        name={['attributes', 'danger']}
      />
      <TextFormItem name={['attributes', 'sub_type']} valuePropName='checked' initialValue={false}>
        <Checkbox onChange={(e) => setIsFlangePreload(e.target.checked)}>
          {intl.get('CALCULATE_FLANGE_PRELOAD')}
        </Checkbox>
      </TextFormItem>
      {isFlangePreload && (
        <>
          <NumberFormItem
            label='NUMBER_OF_BOLT'
            name={['attributes', 'monitoring_points_num']}
            rules={[{ required: true }]}
            inputNumberProps={{ min: 1 }}
          />
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
          <SelectFormItem
            label='SAMPLING_OFFSET'
            name={['attributes', 'sample_time_offset']}
            rules={[{ required: true }]}
            selectProps={{
              options: SAMPLING_OFFSET.map(({ text, value }) => ({ label: intl.get(text), value }))
            }}
          />
          <NumberFormItem
            label='INITIAL_PRELOAD'
            name={['attributes', 'initial_preload']}
            rules={[{ required: true }]}
            inputNumberProps={{ addonAfter: 'kN' }}
          />
          <NumberFormItem
            label='INITIAL_PRESSURE'
            name={['attributes', 'initial_pressure']}
            rules={[{ required: true }]}
            inputNumberProps={{ addonAfter: 'MPa' }}
          />
        </>
      )}
    </>
  );
};
