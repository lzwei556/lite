import React from 'react';
import { Col, ColProps, Form } from 'antd';
import { Card, FormItem, Grid } from '../components';
import { AssetCategory } from '../asset-category';
import { toUniversalFormItemProps } from '../types';
import { generateColProps } from '../utils/grid';
import intl from 'react-intl-universal';

export const SettingFormItems = ({
  type,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 }),
  specialFormItemColProps
}: {
  type: number;
  formItemColProps?: ColProps;
  specialFormItemColProps?: { [key: string]: ColProps };
}) => {
  const formValues = Form.useWatch('attributes');

  const getFormItemColProps = (key: string) => {
    let colProps = formItemColProps;
    if (specialFormItemColProps && specialFormItemColProps[key]) {
      colProps = specialFormItemColProps[key];
    }
    return colProps;
  };

  return AssetCategory.Key.getGroupedSettings(type).map(([group, fields]) => (
    <Card style={{ marginBottom: 16 }} title={intl.get(group).d(group)} key={group}>
      <Grid>
        {fields.map((field) => {
          const visible = field.visibleWhen ? field.visibleWhen(formValues) : true;
          if (!visible) return null;
          return (
            <Col {...getFormItemColProps(field.name)} key={field.name}>
              <FormItem
                {...toUniversalFormItemProps(field, {
                  name: AssetCategory.getNamePath(field.source)
                })}
              />
            </Col>
          );
        })}
      </Grid>
    </Card>
  ));
};
