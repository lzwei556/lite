import { Option } from 'common/types';
import { FormItemProps } from 'antd';
import intl from 'react-intl-universal';
import { UniversalFormItemProps } from '../components/form/formItem';
import { ToSnake } from 'ts-case-convert';

type ToLabel<P extends string> = P extends `${infer First}_${infer Rest}`
  ? `${First}.${ToLabel<Rest>}`
  : P;
type LabelFromName<S extends string> = ToLabel<ToSnake<Lowercase<S>>>;
type Label<Entity extends object, P extends DeepPath<Entity> = DeepPath<Entity>> = LabelFromName<P>;

// eg.
// mixed  initial_thickness: { enabled:true, value:2 }
// separated initial_thickness: 2  initial_thickness_enabled: true
export type NameMode = 'mixed' | 'separated';

type Primitive = string | number | boolean | null | undefined | symbol | bigint;

type DeepPath<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends Function
        ? never
        : T[K] extends Primitive
        ? `${K & string}`
        : T[K] extends readonly any[]
        ? `${K & string}` // arrays stop recursion
        : T[K] extends object
        ? `${K & string}` | `${K & string}.${DeepPath<T[K]>}`
        : never;
    }[keyof T & (string | number)]
  : never;

type FieldType = 'string' | 'number' | 'boolean' | 'enum' | 'number-switcher' | 'number-array';

export type Field<Entity extends Object> = {
  name: DeepPath<Entity>;
  label: Label<Entity> | string;
  description: `${Label<Entity>}.desc` | string;
  type: FieldType;
  options?: Option[];
  optionType?: 'checkbox' | 'select';
  defaultValue?: unknown;
  unit?: string;
  translatingUnit?: string;
  nameMode?: NameMode;
  rules?: FormItemProps['rules'];
  group?: string | number;
};

export const toUniversalFormItemProps = <Entity extends Object>(
  field: Field<Entity>,
  formItemProps?: FormItemProps
): UniversalFormItemProps => {
  const { type, optionType, label, defaultValue, unit, translatingUnit, rules } = field;
  const options = field.options?.map((opt) => ({
    ...opt,
    label: intl.get(opt.label).d(opt.label)
  }));
  const props = {
    label,
    initialValue: defaultValue,
    ...formItemProps,
    rules,
    name: getName(field.name, formItemProps)
  };
  switch (type) {
    case 'boolean':
      return { ...props, radioGroupProps: { options } };
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
    case 'number-array':
      return { numbersProps: { ...props, defaultValue: field.defaultValue } };
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
  const names = FieldHelper.getNamePath(name);
  if (formItemProps) {
    if (formItemProps.name && Array.isArray(formItemProps.name)) {
      return formItemProps.name.concat(names);
    }
  }
  return names;
};

const getUnit = (unit?: string, translatingUnit?: string) => {
  if (unit) {
    return unit;
  } else if (translatingUnit) {
    return intl.get(translatingUnit);
  }
};

export const FieldHelper = {
  getNamePath: (name: string) => name.split('.'),
  getValue: <T, P extends string>(obj: T, path: P): unknown => {
    return path.split('.').reduce<any>((acc, key) => {
      if (acc == null) return undefined;
      return acc[key];
    }, obj);
  }
};
