import React from 'react';
import { Col, ColProps, Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../components/formInputItem';
import { Grid } from '../../components';
import { AssetRow, useContext } from '../asset-common';
import { area, isAssetAreaParent } from '../asset-variant';
import { generateColProps } from '../../utils/grid';

export const UpdateFormItems = ({
  asset,
  formItemColProps = generateColProps({})
}: {
  asset: AssetRow;
  formItemColProps?: ColProps;
}) => {
  const { label } = area;
  const { assets } = useContext();
  const parents = assets.filter(isAssetAreaParent);

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
        {asset.parentId > 0 && (
          <Form.Item label={intl.get(label)} name='parent_id'>
            <Select
              placeholder={intl.get('PLEASE_SELECT_SOMETHING', { something: intl.get(label) })}
            >
              {parents.map(({ id, name }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Col>
    </Grid>
  );
};
