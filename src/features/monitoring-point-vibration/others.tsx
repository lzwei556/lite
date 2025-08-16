import React from 'react';
import { Col, ColProps } from 'antd';
import intl from 'react-intl-universal';
import { SelectFormItem, TextFormItem } from '../../components';
import { AXIS_ALIAS, AXIS_OPTIONS } from '../../asset-common';

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
    <TextFormItem {...restFields} label='POSITION' name={nameProp} rules={[{ required: true }]} />
  );
}

function Axial(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Axial.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <SelectFormItem
      {...restFields}
      label={AXIS_ALIAS.Axial.abbr}
      name={nameProp}
      selectProps={{
        options: AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))
      }}
    />
  );
}

function Vertical(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Vertical.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <SelectFormItem
      {...restFields}
      label={AXIS_ALIAS.Vertical.abbr}
      name={nameProp}
      selectProps={{
        options: AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))
      }}
    />
  );
}

function Horizontal(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Horizontal.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <SelectFormItem
      {...restFields}
      label={AXIS_ALIAS.Horizontal.abbr}
      name={nameProp}
      selectProps={{
        options: AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))
      }}
    />
  );
}
