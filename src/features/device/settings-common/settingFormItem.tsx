import { useState } from 'react';
import {
  Col,
  ColProps,
  FormItemProps,
  FormRule,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  SelectProps
} from 'antd';
import intl from 'react-intl-universal';
import { useFormItemBindingsProps } from '../../../hooks';
import { FormItem, Term } from '../../../components';
import { DeviceSetting } from './common';
import { CheckboxGroupProps } from 'antd/es/checkbox';

enum DeviceSettingValueType {
  uint8 = 'uint8',
  uint16 = 'uint16',
  uint32 = 'uint32',
  uint64 = 'uint64',
  float = 'float',
  string = 'string',
  bool = 'bool'
}

export const SettingFormItem = ({
  value,
  formItemColProps,
  ignoreChildren = false
}: {
  value: DeviceSetting;
  ignoreChildren?: boolean;
  formItemColProps?: ColProps;
}) => {
  const [setting, setSetting] = useState<DeviceSetting>(transformValue(value));

  const renderFormItem = (props: FormItemProps) => {
    const { options, optionType, onChange, type, unit } = setting;
    let radioGroupProps: RadioGroupProps | undefined,
      checkboxGroupProps: CheckboxGroupProps | undefined,
      selectProps: SelectProps | undefined,
      inputNumberProps: InputNumberProps | undefined,
      inputProps: InputProps | undefined;
    if (options) {
      const props = {
        onChange: (value: any) => {
          if (onChange) {
            onChange(value);
          } else {
            setSetting({ ...setting, value });
          }
        },
        options: Object.keys(options).map((value) => ({
          label: intl.get(options[value]).d(options[value]),
          value: Number(value)
        }))
      };
      if (optionType === 'checkbox') {
        checkboxGroupProps = props;
      } else {
        selectProps = props;
      }
    } else {
      const intlUnit = unit ? intl.get(unit).d(unit) : '';
      if (type === DeviceSettingValueType.bool) {
        radioGroupProps = {
          onChange: (e) => {
            if (onChange) {
              onChange(e.target.value);
            } else {
              setSetting({ ...setting, value: e.target.value });
            }
          }
        };
      } else if (type === DeviceSettingValueType.string) {
        inputProps = { addonAfter: intlUnit };
      } else {
        inputNumberProps = { addonAfter: intlUnit, style: { width: '100%' } };
      }
    }
    return (
      <FormItem
        {...props}
        checkboxGroupProps={checkboxGroupProps}
        inputNumberProps={inputNumberProps}
        inputProps={inputProps}
        radioGroupProps={radioGroupProps}
        selectProps={selectProps}
      />
    );
  };

  const renderChildren = () => {
    return (
      setting.children &&
      setting.children
        .sort((prev, next) => prev.sort - next.sort)
        .map((child) => {
          if (setting.value === child.show) {
            return (
              <SettingFormItem value={child} key={child.key} formItemColProps={formItemColProps} />
            );
          } else if (
            setting.options &&
            Array.isArray(setting.value) &&
            setting.value.includes(child.show)
          ) {
            return (
              <SettingFormItem value={child} key={child.key} formItemColProps={formItemColProps} />
            );
          }
          return null;
        })
    );
  };

  const getRules = (setting: DeviceSetting) => {
    const rules: FormRule[] = [];
    const { validator, options } = setting;
    if (validator && !options) {
      rules.push(transformRule(validator));
    }
    return rules;
  };

  function transformRule(rule: DeviceSetting['validator']) {
    //number range, eg. {min:1,max:3}
    if (
      typeof rule === 'object' &&
      Object.keys(rule).length === 2 &&
      rule.hasOwnProperty('min') &&
      rule.hasOwnProperty('max')
    ) {
      return { ...rule, type: 'number' };
    }
    return rule;
  }

  function transformValue(setting: DeviceSetting) {
    if (setting.options && setting.optionType === 'checkbox') {
      return {
        ...setting,
        value: valueToArray(
          Object.keys(setting.options).map((value) => Number(value)),
          setting.value
        )
      };
    }
    return setting;
  }

  function valueToArray(optionArray: number[], value: number) {
    var ret = [];
    for (let i = 0; i < optionArray.length; i++) {
      if ((value & optionArray[i]) > 0) {
        ret.push(optionArray[i]);
      }
    }
    return ret;
  }

  const formItemProps = useFormItemBindingsProps({
    label: <Term name={intl.get(setting.name)} description={intl.get(`${setting.name}_DESC`)} />,
    name: [setting.category, setting.key],
    initialValue: setting.value,
    rules: getRules(setting),
    messageVariables: { label: intl.get(setting.name).toLowerCase() }
  });

  return (
    <>
      <Col {...formItemColProps}>{renderFormItem(formItemProps)}</Col>
      {!ignoreChildren && renderChildren()}
    </>
  );
};
