import React from 'react';
import { Col, ColProps, Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { Grid } from '../../components';
import { FormInputItem } from '../../components/formInputItem';
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
  const label = intl.get('ASSET');
  const parents = useParents();

  return (
    <Grid>
      <Col {...formItemColProps}>
        <FormInputItem
          label={intl.get('NAME')}
          name='name'
          requiredMessage={intl.get('PLEASE_ENTER_NAME')}
          lengthLimit={{ min: 4, max: 50, label: intl.get('NAME').toLowerCase() }}
        >
          <Input placeholder={intl.get('PLEASE_ENTER_NAME')} />
        </FormInputItem>
      </Col>
      <Col {...formItemColProps}>
        <Form.Item
          label={label}
          name='parent_id'
          rules={[
            {
              required: true,
              message: intl.get('PLEASE_SELECT_SOMETHING', { something: label })
            }
          ]}
        >
          <Select placeholder={intl.get('PLEASE_SELECT_SOMETHING', { something: label })}>
            {parents.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col {...formItemColProps}>
        <TypeFormItem disabled={true} types={types} />
      </Col>
    </Grid>
  );
};
