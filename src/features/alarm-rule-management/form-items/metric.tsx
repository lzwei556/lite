import React from 'react';
import { Cascader } from 'antd';
import intl from 'react-intl-universal';
import { TextFormItem } from '../../../components';
import * as Feature from 'domains/feature-property';

export const MetricFormItem = ({
  disabled,
  nameIndex,
  onChange,
  properties
}: {
  disabled?: boolean;
  nameIndex: number;
  onChange: (unit?: string) => void;
  properties: Feature.Types.Property[];
}) => {
  return (
    <TextFormItem
      name={[nameIndex, 'metric']}
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
        onChange={(value) => {
          const property = properties.find(({ key }) => key === value[0]);
          if (property) {
            const unit = property.unit
              ? intl.get(property.unit).d(property.unit)
              : property.unit || '';
            onChange?.(unit);
          }
        }}
        options={properties.map((p) => ({
          ...p,
          label: intl.get(p.name),
          fields: p.fields?.map((field) => ({
            ...field,
            label: intl.get(field.name)
          }))
        }))}
        fieldNames={{ value: 'key', children: 'fields' }}
        style={{ width: 160 }}
      />
    </TextFormItem>
  );
};
