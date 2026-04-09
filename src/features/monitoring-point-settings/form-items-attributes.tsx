import { Col, ColProps, FormItemProps } from 'antd';
import { FormItem } from 'components';
import * as MonitoringPoint from 'domain/monitoring-point';
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
  return MonitoringPoint.Type.getSettings(type)
    .map((attr) => toUniversalFormItemProps(attr, formItemProps))
    .map((props, index) => (
      <Col key={index} {...formItemColProps}>
        <FormItem {...props} />
      </Col>
    ));
};
