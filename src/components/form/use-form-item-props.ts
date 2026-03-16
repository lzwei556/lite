import { FormItemProps } from 'antd';
import { Translation } from 'locales/utils';

export const useFormItemIntlProps = (props: FormItemProps): FormItemProps => {
  const { label: originLabel, rules, ...rest } = props;
  const isLabelString = typeof originLabel === 'string';
  const label = isLabelString ? Translation.get(originLabel as string) : originLabel;
  return {
    ...rest,
    label,
    rules: rules?.map((rule) =>
      translateRuleMessage(rule, isLabelString ? (label as string) : undefined)
    )
  };
};

type Rule = NonNullable<FormItemProps['rules']>[0];

const translateRuleMessage = (rule: Rule, label?: string): Rule => {
  if (typeof rule == 'function') {
    return rule;
  } else {
    let message = rule.message;
    if (!message && rule.required && label) {
      message = getRequiredMessage(label);
    } else if (message && typeof message === 'string') {
      message = Translation.get(message);
    }
    return { ...rule, message };
  }
};

export const getRequiredMessage = (label: string) => {
  return Translation.pleaseEnterSth(smoothCapitalization(label));
};

const smoothCapitalization = (text: string) => {
  return text
    .split(' ')
    .map((word) => (/\b[A-Z]+\b/g.test(word) ? word : word.toLowerCase()))
    .join(' ');
};
