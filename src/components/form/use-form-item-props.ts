import React from 'react';
import { FormItemProps } from 'antd';
import { RuleObject } from 'antd/es/form';
import intl from 'react-intl-universal';

export const useFormItemIntlProps = (props: FormItemProps): FormItemProps => {
  const { label, rules, ...rest } = props;
  return isLabelString(label)
    ? { ...rest, label: intl.get(label), rules: mixLabelToOjectRules(rules, label) }
    : props;
};

export const useTextControlPlaceHolder = (label: React.ReactNode) => {
  return isLabelString(label)
    ? intl.get('PLEASE_ENTER_SOMETHING', { something: intl.get(label).toLowerCase() })
    : undefined;
};

const isLabelString = (label: React.ReactNode) => {
  return typeof label === 'string';
};

const mixLabelToOjectRules = (
  rules: FormItemProps['rules'],
  label: string
): FormItemProps['rules'] => {
  return rules?.map((rule) => {
    return typeof rule == 'function' ? rule : padMessage(rule, label);
  });
};

const padMessage = (rule: RuleObject, label: string) => {
  let message = rule.message;
  if (message) {
    return rule;
  }
  if (rule.required) {
    message = intl.get('PLEASE_ENTER_SOMETHING', { something: intl.get(label) });
  }
  if (rule.min && rule.max && rule.type === 'string') {
    message = intl.get('string.length.range.pattern', {
      something: intl.get(label),
      min: rule.min,
      max: rule.max
    });
  }
  return { ...rule, message };
};
