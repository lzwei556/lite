import React from 'react';
import { Col, ColProps, Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../components/formInputItem';
import { AssetCategory, AssetRow } from '../asset-common';
import { SettingFormItems } from './settingFormItems';
import { TypeFormItem } from './typeFormItem';
import { useParents } from './utils';
import { Card, Grid } from '../../components';
import { generateColProps } from '../../utils/grid';

export const UpdateFormItems = ({
  asset,
  types,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  asset: AssetRow;
  types: AssetCategory[];
  formItemColProps?: ColProps;
}) => {
  const { type } = asset;
  const label = intl.get('ASSET');
  const parents = useParents();

  return (
    <>
      <Card size='small' style={{ marginBlock: 16 }} title={intl.get('BASIC_INFORMATION')}>
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
      </Card>
      {type && <SettingFormItems key={type} type={type} formItemColProps={formItemColProps} />}
    </>
  );
};
