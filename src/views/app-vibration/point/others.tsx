import React from 'react';
import { Col, Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../components/formInputItem';
import { AXIS, AXIS_ALIAS, AXIS_OPTIONS } from '../../asset-common';

type FieldProps = {
  mode: 'create' | 'update';
  nameIndex?: number;
  restFields?: {
    fieldKey?: number | undefined;
  };
};

export const Others = (props: FieldProps) => {
  const { mode } = props;

  if (mode === 'create') {
    return (
      <>
        <Col span={12}>
          <Position {...props} />
        </Col>
        <Col span={12}>
          <Axial {...props} />
        </Col>
        <Col span={12}>
          <Vertical {...props} />
        </Col>
        <Col span={12}>
          <Horizontal {...props} />
        </Col>
      </>
    );
  } else {
    return (
      <>
        <Position {...props} />
        <Axial {...props} />
        <Vertical {...props} />
        <Horizontal {...props} />
      </>
    );
  }
};

function Position(props: FieldProps) {
  const { mode, nameIndex, restFields } = props;
  const commonNameProp = ['attributes', 'index'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;
  const isModeCreate = mode === 'create';

  return (
    <FormInputItem
      {...restFields}
      label={intl.get('POSITION')}
      name={nameProp}
      requiredMessage={intl.get('PLEASE_ENTER_POSITION')}
      style={isModeCreate ? { display: 'inline-block', width: 200, marginRight: 20 } : undefined}
    >
      <Input />
    </FormInputItem>
  );
}

function Axial(props: FieldProps) {
  const { mode, nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Axial.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;
  const isModeCreate = mode === 'create';

  return (
    <Form.Item
      {...restFields}
      initialValue={AXIS.Z.key}
      label={intl.get(AXIS_ALIAS.Axial.label)}
      name={nameProp}
      style={isModeCreate ? { display: 'inline-block', width: 200, marginRight: 20 } : undefined}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}

function Vertical(props: FieldProps) {
  const { mode, nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Vertical.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;
  const isModeCreate = mode === 'create';

  return (
    <Form.Item
      {...restFields}
      initialValue={AXIS.Y.key}
      label={intl.get(AXIS_ALIAS.Vertical.label)}
      name={nameProp}
      style={isModeCreate ? { display: 'inline-block', width: 200, marginRight: 20 } : undefined}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}

function Horizontal(props: FieldProps) {
  const { mode, nameIndex, restFields } = props;
  const commonNameProp = ['attributes', AXIS_ALIAS.Horizontal.key];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;
  const isModeCreate = mode === 'create';

  return (
    <Form.Item
      {...restFields}
      initialValue={AXIS.X.key}
      label={intl.get(AXIS_ALIAS.Horizontal.label)}
      name={nameProp}
      style={isModeCreate ? { display: 'inline-block', width: 200, marginRight: 20 } : undefined}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}
