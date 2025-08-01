import React from 'react';
import { SelectFormItem, TextFormItem } from '../../../components';
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
      <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      <TextFormItem name='type' hidden={true} initialValue={type} />
      <SelectFormItem
        label={label}
        name='parent_id'
        rules={[{ required: true }]}
        selectProps={{ options: winds.map(({ id, name }) => ({ label: name, value: id })) }}
      />
      <SelectFormItem
        label='INDEX_NUMBER'
        name={['attributes', 'index']}
        initialValue={1}
        selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
      />
    </>
  );
};
