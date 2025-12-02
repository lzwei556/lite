import React from 'react';
import { Form, FormItemProps, Space, Switch } from 'antd';
import { TextFormItem } from './textFormItem';
import { NumberFormItem } from './numberFormItem';
import { getRequiredMessage, useFormItemIntlProps } from './use-form-item-props';
import { NameMode } from 'types';

export type NumberFormItemWithSwitcherProps = FormItemProps & {
  enabled?: boolean;
  nameMode?: NameMode;
  namePrefix?: string;
};

export const NumberFormItemWithSwitcher = ({
  enabled: enabledFromProps,
  name,
  nameMode = 'separated',
  namePrefix,
  ...rest
}: NumberFormItemWithSwitcherProps) => {
  const namePath = Array.isArray(name) ? name : [name];
  const { enabledName, valueName } = getName(namePath, nameMode);
  const [enabled, setEnabled] = React.useState(enabledFromProps ?? false);
  const { label, rules = [] } = useFormItemIntlProps(rest);
  const form = Form.useFormInstance();

  return (
    <TextFormItem
      label={
        <Space>
          {label}
          <TextFormItem {...rest} initialValue={false} noStyle={true} name={enabledName}>
            <Switch
              onChange={(enabled) => {
                setEnabled(enabled);
                form.validateFields(namePrefix ? [[namePrefix].concat(valueName)] : [valueName]);
              }}
              size='small'
              value={enabled}
            />
          </TextFormItem>
        </Space>
      }
    >
      <NumberFormItem
        {...{
          ...rest,
          rules: [
            { required: enabled, message: getRequiredMessage(rest.label as string) },
            ...rules
          ]
        }}
        noStyle={true}
        name={valueName}
      />
    </TextFormItem>
  );
};

const getName = (paths: any[], nameMode: NameMode) => {
  if (nameMode === 'mixed') {
    return { enabledName: paths.concat('enabled'), valueName: paths.concat('value') };
  } else {
    const last = paths[paths.length - 1];
    const rest = paths.slice(0, paths.length - 1);
    return { enabledName: rest.concat(`${last}_enabled`), valueName: paths };
  }
};
