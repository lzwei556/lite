import React from 'react';
import { Col, ColProps } from 'antd';
import { generateColProps } from '../../../utils/grid';
import { Grid, SelectFormItem, TextFormItem } from '../../../components';
import { useContext } from '../../asset-common';
import { tower, wind } from '../constants';
import { useParentTypes } from '../utils';

export const UpdateFormItems = ({
  formItemColProps = generateColProps({})
}: {
  formItemColProps?: ColProps;
}) => {
  const { assets } = useContext();
  const { label } = wind;
  const { type } = tower;
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
          label='INDEX_NUMBER'
          name={['attributes', 'index']}
          selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
        />
      </Col>
    </Grid>
  );
};
