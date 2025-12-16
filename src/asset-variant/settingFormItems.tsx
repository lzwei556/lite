import React from 'react';
import { Col, ColProps, Form } from 'antd';
import { Card, CardProps, FormItem, Grid } from '../components';
import { AssetCategory } from '../asset-category';
import { toUniversalFormItemProps } from '../types';
import { generateColProps } from '../utils/grid';
import intl from 'react-intl-universal';

export const SettingFormItems = ({
  type,
  cardProps,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  type: number;
  cardProps?: CardProps;
  formItemColProps?: ColProps;
}) => {
  const formValues = Form.useWatch('attributes');

  return AssetCategory.Key.getSettings(type).map(({ label, fields }) => (
    <Card style={{ marginBottom: 16 }} title={intl.get(label).d(label)} key={label}>
      <Grid>
        {fields.map((field) => {
          const visible = field.visibleWhen ? field.visibleWhen(formValues) : true;
          if (!visible) return null;
          return (
            <Col {...formItemColProps} key={field.name}>
              <FormItem
                {...toUniversalFormItemProps(field, {
                  name: field.source === 'motor' ? ['attributes', 'motor'] : ['attributes']
                })}
              />
            </Col>
          );
        })}
      </Grid>
    </Card>
  ));
};
