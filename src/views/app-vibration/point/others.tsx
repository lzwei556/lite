import React from 'react';
import { Col, Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../components/formInputItem';

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

export const AXIS_OPTIONS = [
  { label: 'AXIS_X', value: 0, key: 'x' },
  { label: 'AXIS_Y', value: 1, key: 'y' },
  { label: 'AXIS_Z', value: 2, key: 'z' }
];

function Axial(props: FieldProps) {
  const { mode, nameIndex, restFields } = props;
  const commonNameProp = ['attributes', 'axial'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;
  const isModeCreate = mode === 'create';

  return (
    <Form.Item
      {...restFields}
      initialValue={'x'}
      label={intl.get('axis.axial')}
      name={nameProp}
      style={isModeCreate ? { display: 'inline-block', width: 200, marginRight: 20 } : undefined}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}

function Vertical(props: FieldProps) {
  const { mode, nameIndex, restFields } = props;
  const commonNameProp = ['attributes', 'vertical'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;
  const isModeCreate = mode === 'create';

  return (
    <Form.Item
      {...restFields}
      initialValue={'y'}
      label={intl.get('axis.vertical')}
      name={nameProp}
      style={isModeCreate ? { display: 'inline-block', width: 200, marginRight: 20 } : undefined}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}

function Horizontal(props: FieldProps) {
  const { mode, nameIndex, restFields } = props;
  const commonNameProp = ['attributes', 'horizontal'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;
  const isModeCreate = mode === 'create';

  return (
    <Form.Item
      {...restFields}
      initialValue={'z'}
      label={intl.get('axis.horizontal')}
      name={nameProp}
      style={isModeCreate ? { display: 'inline-block', width: 200, marginRight: 20 } : undefined}
    >
      <Select options={AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }))} />
    </Form.Item>
  );
}
