import React from 'react';
import { Col, ColProps } from 'antd';
import { Grid, SelectFormItem, TextFormItem } from '../../components';
import { generateColProps } from '../../utils/grid';
import { AssetRow, useContext } from '../asset-common';
import { area, isAssetAreaParent } from '../asset-variant';

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
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      </Col>
      <Col {...formItemColProps}>
        {asset.parentId > 0 && (
          <SelectFormItem
            label={label}
            name='parent_id'
            selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        )}
      </Col>
    </Grid>
  );
};
