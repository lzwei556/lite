import React from 'react';
import intl from 'react-intl-universal';
import { FormInputItem, FormInputItemProps } from '../../../components/formInputItem';

export const DurationFormItem = ({
  nameIndex,
  ...rest
}: FormInputItemProps & {
  nameIndex: number;
  numericChildren?: JSX.Element;
}) => {
  return (
    <FormInputItem
      {...rest}
      initialValue={1}
      name={[nameIndex, 'duration']}
      noStyle
      numericRule={{
        isInteger: true,
        min: 1,
        message: intl.get('UNSIGNED_INTEGER_ENTER_PROMPT')
      }}
      requiredMessage={intl.get('PLEASE_ENTER_SOMETHING', {
        something: intl.get('DURATION')
      })}
    />
  );
};
