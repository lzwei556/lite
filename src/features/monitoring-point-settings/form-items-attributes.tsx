import { Col, ColProps, FormItemProps } from 'antd';
import { Key } from 'common/monitoring-point-type';
import { FormItem } from 'components';
import React from 'react';
import { toUniversalFormItemProps } from 'types';
import { generateColProps } from 'utils/grid';

export const FormItemsAttributes = ({
  type,
  formItemColProps = generateColProps({}),
  formItemProps = { name: ['attributes'] }
}: {
  type: number;
  formItemColProps?: ColProps;
  formItemProps?: FormItemProps;
}) => {
  return Key.getAttributes(type)
    .map((attr) => toUniversalFormItemProps(attr, formItemProps))
    .map((props, index) => (
      <Col key={index} {...formItemColProps}>
        <FormItem {...props} />
      </Col>
    ));
};
