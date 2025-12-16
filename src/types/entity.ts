import { ToSnake } from 'ts-case-convert';
import { Option } from '../common';
import { FormItemProps } from 'antd';
import intl from 'react-intl-universal';
import { UniversalFormItemProps } from '../components/form/formItem';

type ToLabel<P> = P extends `${infer First}_${infer Rest}` ? `${First}.${ToLabel<Rest>}` : P;

type Name<Entity extends Object> = keyof Entity;
type Label<Entity extends Object> = ToLabel<Lowercase<ToSnake<Name<Entity>>>>;
// eg.
// mixed  initial_thickness: { enabled:true, value:2 }
// separated initial_thickness: 2  initial_thickness_enabled: true
export type NameMode = 'mixed' | 'separated';

export type Field<Entity extends Object> = {
  name: Name<Entity>;
  label: Label<Entity> | string;
  description: `${Label<Entity>}.desc`;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'number-switcher';
  options?: Option[];
  optionType?: 'checkbox' | 'select';
  defaultValue?: any;
  unit?: string;
  translatingUnit?: string;
  nameMode?: NameMode;
};

export const toUniversalFormItemProps = <Entity extends Object>(
  field: Field<Entity>,
  formItemProps?: FormItemProps
): UniversalFormItemProps => {
  const { type, optionType, label, defaultValue, unit, translatingUnit } = field;
  const options = field.options?.map((opt) => ({
    ...opt,
    label: intl.get(opt.label).d(opt.label)
  }));
  const props = {
    label,
    initialValue: defaultValue,
    ...formItemProps,
    name: getName(field.name, formItemProps)
  };
  switch (type) {
    case 'boolean':
      return { ...props, radioGroupProps: { options, optionType: 'default' } };
    case 'number':
      return { ...props, inputNumberProps: { addonAfter: getUnit(unit, translatingUnit) } };
    case 'enum':
      if (optionType === 'checkbox') {
        return { ...props, checkboxGroupProps: { options } };
      } else {
        return { ...props, selectProps: { options } };
      }
    case 'number-switcher':
      return { numberFormItemWithSwitcherProps: { ...props, nameMode: field.nameMode } };
    case 'string':
      return props;
    default:
      return props;
  }
};

const getName = <Entity extends Object>(
  name: Field<Entity>['name'],
  formItemProps?: FormItemProps
) => {
  if (formItemProps) {
    if (formItemProps.name && Array.isArray(formItemProps.name)) {
      return formItemProps.name.concat(name);
    }
  }
  return name;
};

const getUnit = (unit?: string, translatingUnit?: string) => {
  if (unit) {
    return unit;
  } else if (translatingUnit) {
    return intl.get(translatingUnit);
  }
};
