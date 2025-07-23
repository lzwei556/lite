import React from 'react';
import { Col, ColProps, Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../components/formInputItem';
import { AXIS, AXIS_ALIAS, AXIS_OPTIONS } from '../../asset-common';

type FieldProps = {
  formItemColProps: ColProps;
  nameIndex?: number;
  restFields?: {
    fieldKey?: number | undefined;
  };
};

export const Others = ({ formItemColProps, ...props }: FieldProps) => {
  return (
    <>
      <Col {...formItemColProps}>
        <Position {...props} />
      </Col>
      <Col {...formItemColProps}>
        <Axial {...props} />
      </Col>
      <Col {...formItemColProps}>
        <Vertical {...props} />
      </Col>
      <Col {...formItemColProps}>
        <Horizontal {...props} />
      </Col>
    </>
  );
};

function Position(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', 'index'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <FormInputItem
      {...restFields}
      label={intl.get('POSITION')}
      name={nameProp}
      requiredMessage={intl.get('PLEASE_ENTER_POSITION')}
    >
      <Input />
    </FormInputItem>
  );
}

function Axial(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Axial.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <Form.Item
      {...restFields}
      initialValue={AXIS.Z.key}
      label={intl.get(AXIS_ALIAS.Axial.label)}
      name={nameProp}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}

function Vertical(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Vertical.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <Form.Item
      {...restFields}
      initialValue={AXIS.Y.key}
      label={intl.get(AXIS_ALIAS.Vertical.label)}
      name={nameProp}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}

function Horizontal(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Horizontal.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <Form.Item
      {...restFields}
      initialValue={AXIS.X.key}
      label={intl.get(AXIS_ALIAS.Horizontal.label)}
      name={nameProp}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}
