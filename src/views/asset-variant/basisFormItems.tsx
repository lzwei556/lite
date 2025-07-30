import React from 'react';
import { Col, ColProps } from 'antd';
import { Grid, SelectFormItem, TextFormItem } from '../../components';
import { generateColProps } from '../../utils/grid';
import { AssetCategory } from '../asset-common';
import { TypeFormItem } from './typeFormItem';
import { useParents } from './utils';

export const BasisFormItems = ({
  types,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  types: AssetCategory[];
  formItemColProps?: ColProps;
}) => {
  const parents = useParents();

  return (
    <Grid>
      <Col {...formItemColProps}>
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='ASSET'
          name='parent_id'
          rules={[{ required: true }]}
          selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
        />
      </Col>
      <Col {...formItemColProps}>
        <TypeFormItem disabled={true} types={types} />
      </Col>
    </Grid>
  );
};
