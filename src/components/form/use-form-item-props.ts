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
    message = getRequiredMessage(label);
  }
  return { ...rule, message };
};

const getRequiredMessage = (label: string) => {
  return intl.get('PLEASE_ENTER_SOMETHING', {
    something: smoothCapitalization(intl.get(label))
  });
};

const smoothCapitalization = (text: string) => {
  return text
    .split(' ')
    .map((word) => (/\b[A-Z]+\b/g.test(word) ? word : word.toLowerCase()))
    .join(' ');
};
