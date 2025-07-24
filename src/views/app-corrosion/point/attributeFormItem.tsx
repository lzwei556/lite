import * as React from 'react';
import { Form, InputNumber, Space, Switch } from 'antd';

export const AttributeFormItem: React.FC<{
  label: string;
  name: string;
  nameIndex?: number;
  restFields?: {
    fieldKey?: number | undefined;
  };
}> = ({ label, name, nameIndex, restFields }) => {
  const commonNameProp = ['attributes', name];
  const nameProp = nameIndex !== undefined ? [`${nameIndex}`, ...commonNameProp] : commonNameProp;

  //request structure
  // initial_thickness: { enabled: true; value: 5 };
  // response structure
  // initial_thickness_enabled: true
  // initial_thickness: 5;

  //request structure
  // critical_thickness: { enabled: false};
  // response structure
  // critical_thickness_enabled: false
  const radioGroupNameProp = [...nameProp, 'enabled'];
  const inputGroupNameProp = [...nameProp, 'value'];

  return (
    <Form.Item
      label={
        <Space>
          {label}
          <Form.Item {...restFields} noStyle={true} name={radioGroupNameProp} initialValue={false}>
            <Switch size='small' />
          </Form.Item>
        </Space>
      }
    >
      <Form.Item {...restFields} noStyle={true} name={inputGroupNameProp}>
        <InputNumber
          placeholder={label}
          controls={false}
          addonAfter='mm'
          style={{ width: '100%' }}
        />
      </Form.Item>
    </Form.Item>
  );
};
