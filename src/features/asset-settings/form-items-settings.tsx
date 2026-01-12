import { Col, ColProps, Form } from "antd";
import { AssetCategory } from "common/asset-category";
import { Card, FormItem, Grid } from "components";
import React from "react";
import intl from "react-intl-universal";
import { generateColProps } from "utils/grid";
import { toUniversalFormItemProps } from 'types';

export const FormItemsSettings =({
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

  return AssetCategory.Key.getSettings(type).map(({ label, fields }) => (
    <Card style={{ marginBottom: 16 }} title={intl.get(label).d(label)} key={label}>
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
