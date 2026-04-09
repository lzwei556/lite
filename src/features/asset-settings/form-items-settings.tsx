import { Col, ColProps, Form } from 'antd';
import { Card, FormItem, Grid } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { generateColProps } from 'utils/grid';
import { toUniversalFormItemProps } from 'types';
import { PrimaryAsset } from 'domain/asset';

export const FormItemsSettings = ({
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

  return PrimaryAsset.getGroupedSettings(type).map(([group, fields], i) => (
    <Card
      style={{ marginTop: i === 0 ? 16 : 0, marginBottom: 16 }}
      title={intl.get(group).d(group)}
      key={group}
    >
      <Grid>
        {fields.map((field) => {
          const visible = field.visibleWhen ? field.visibleWhen(formValues) : true;
          if (!visible) return null;
          return (
            <Col {...getFormItemColProps(field.name)} key={field.name}>
              <FormItem {...toUniversalFormItemProps(field)} />
            </Col>
          );
        })}
      </Grid>
    </Card>
  ));
};
