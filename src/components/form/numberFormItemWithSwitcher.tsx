import React from 'react';
import { FormItemProps, Space, Switch } from 'antd';
import intl from 'react-intl-universal';
import { TextFormItem } from './textFormItem';
import { NumberFormItem, NumberFromItemProps } from './numberFormItem';
import { getRequiredMessage } from './use-form-item-props';

export const NumberFormItemWithSwitcher = ({
  label,
  name,
  enabledFormItemProps,
  enabled: enabledFormProps,
  numberFormItemProps
}: {
  label: string;
  name: string[];
  enabledFormItemProps?: Omit<FormItemProps, 'name' | 'noStyle'>;
  enabled?: boolean;
  numberFormItemProps?: Omit<NumberFromItemProps, 'name' | 'noStyle'>;
}) => {
  const [enabled, setEnabled] = React.useState(enabledFormProps ?? false);
  const { rules = [], ...rest } = numberFormItemProps || {};
  return (
    <TextFormItem
      label={
        <Space>
          {intl.get(label)}
          <TextFormItem {...enabledFormItemProps} noStyle={true} name={[...name, 'enabled']}>
            <Switch size='small' onChange={setEnabled} value={enabled} />
          </TextFormItem>
        </Space>
      }
    >
      <NumberFormItem
        {...{
          ...rest,
          rules: enabled
            ? [{ required: true, message: getRequiredMessage(label) }, ...rules]
            : rules
        }}
        noStyle={true}
        name={[...name, 'value']}
      />
    </TextFormItem>
  );
};
