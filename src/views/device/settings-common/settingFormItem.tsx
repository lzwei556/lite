import { useState } from 'react';
import { Checkbox, Col, ColProps, Form, FormRule, Input, InputNumber, Radio, Select } from 'antd';
import intl from 'react-intl-universal';
import { Term } from '../../../components';
import { DeviceSetting } from './common';

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

  const renderComponents = () => {
    const unit = setting.unit ? intl.get(setting.unit).d(setting.unit) : '';
    switch (setting.type) {
      case DeviceSettingValueType.bool:
        return (
          <Radio.Group
            buttonStyle='solid'
            onChange={(e) => {
              if (setting.onChange) {
                setting.onChange(e.target.value);
              } else {
                setSetting({ ...setting, value: e.target.value });
              }
            }}
            options={[
              { label: intl.get('ENABLED'), value: true },
              { label: intl.get('DISABLED'), value: false }
            ]}
            optionType='button'
          />
        );
    }
    if (setting.options) {
      if (setting.optionType === 'checkbox') {
        return (
          <Checkbox.Group
            options={Object.keys(setting.options).map((value) => ({
              label: intl.get(setting.options[value]),
              value: Number(value)
            }))}
            onChange={(value) => setSetting({ ...setting, value })}
          />
        );
      }
      return (
        <Select
          onChange={(value) => {
            if (setting.onChange) {
              setting.onChange(value);
            } else {
              setSetting({ ...setting, value: value });
            }
          }}
          options={Object.keys(setting.options).map((key) => ({
            label: intl.get(setting.options[key]).d(setting.options[key]),
            value: Number(key)
          }))}
        />
      );
    }
    if (setting.type === DeviceSettingValueType.string) {
      return <Input suffix={unit} />;
    } else {
      return <InputNumber controls={false} style={{ width: '100%' }} addonAfter={unit} />;
    }
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

  return (
    <>
      <Col {...formItemColProps}>
        <Form.Item
          label={
            <Term name={intl.get(setting.name)} description={intl.get(`${setting.name}_DESC`)} />
          }
          name={[setting.category, setting.key]}
          initialValue={setting.value}
          rules={getRules(setting)}
          messageVariables={{ label: intl.get(setting.name).toLowerCase() }}
        >
          {renderComponents()}
        </Form.Item>
      </Col>
      {!ignoreChildren && renderChildren()}
    </>
  );
};
