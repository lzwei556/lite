import React from 'react';
import { Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../components/formInputItem';
import { useContext } from '../../asset-common';
import { tower, wind } from '../constants';
import { useParentTypes } from '../utils';

export const UpdateFormItems = () => {
  const { assets } = useContext();
  const { label } = wind;
  const { type } = tower;
  const parentTypes = useParentTypes(type);
  const winds = assets.filter((a) => parentTypes.map(({ type }) => type).includes(a.type));

  return (
    <>
      <FormInputItem
        label={intl.get('NAME')}
        name='name'
        requiredMessage={intl.get('PLEASE_ENTER_NAME')}
        lengthLimit={{ min: 4, max: 50, label: intl.get('NAME').toLowerCase() }}
      >
        <Input placeholder={intl.get('PLEASE_ENTER_NAME')} />
      </FormInputItem>
      <Form.Item name='type' hidden={true} initialValue={type}>
        <Input />
      </Form.Item>
      <Form.Item
        label={intl.get(label)}
        name='parent_id'
        rules={[
          {
            required: true,
            message: intl.get('PLEASE_SELECT_SOMETHING', { something: intl.get(label) })
          }
        ]}
      >
        <Select placeholder={intl.get('PLEASE_SELECT_SOMETHING', { something: intl.get(label) })}>
          {winds.map(({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={intl.get('INDEX_NUMBER')} name={['attributes', 'index']} initialValue={1}>
        <Select>
          {[1, 2, 3, 4, 5].map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};
