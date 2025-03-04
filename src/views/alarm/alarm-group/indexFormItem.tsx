import React from 'react';
import { Cascader, CascaderProps, Form } from 'antd';
import intl from 'react-intl-universal';
import { DisplayProperty } from '../../../constants/properties';
import { FormInputItemProps } from '../../../components/formInputItem';

export const IndexFormItem = ({
  disabled,
  nameIndex,
  onChange,
  properties,
  ...rest
}: FormInputItemProps & {
  disabled: boolean;
  onChange: (metric: { key: string; name: string; unit: string }) => void;
  nameIndex: number;
  properties: DisplayProperty[];
}) => {
  const handleChange: CascaderProps['onChange'] = (e, selectOptions) => {
    if (e !== undefined) {
      const property = properties.find(({ key }) => key === e[0]);
      if (property) {
        const selected = e.length === 1 ? [...e, ...e] : e;
        const metric = {
          key: selected.join('.'),
          name: selectOptions.map(({ name }) => name).join(':'),
          unit: property.unit ? intl.get(property.unit).d(property.unit) : property.unit || ''
        };
        onChange(metric);
      }
    }
  };

  return (
    <Form.Item
      {...rest}
      name={[nameIndex, 'index']}
      noStyle
      rules={[
        {
          required: true,
          message: ''
        }
      ]}
    >
      <Cascader
        disabled={disabled}
        popupClassName='alarm-rule-creation-cascader'
        onChange={handleChange}
        options={properties.map((p) => ({
          ...p,
          label: intl.get(p.name),
          fields: p.fields?.map((field) => ({
            ...field,
            label: intl.get(field.name)
          }))
        }))}
        placeholder={intl.get('PLEASE_SELECT_INDEX_NAME')}
        fieldNames={{ value: 'key', children: 'fields' }}
        style={{ width: 160 }}
      />
    </Form.Item>
  );
};
