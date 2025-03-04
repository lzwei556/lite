import React from 'react';
import { Input } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem, FormInputItemProps } from '../../../components/formInputItem';

export const NameFormItem = ({
  disabled,
  nameIndex,
  ...rest
}: FormInputItemProps & {
  disabled?: boolean;
  nameIndex: number;
}) => {
  return (
    <FormInputItem
      {...rest}
      lengthLimit={{
        min: 4,
        max: 16,
        label: intl.get('NAME').toLowerCase()
      }}
      name={[nameIndex, 'name']}
      noStyle
      requiredMessage={' '}
    >
      <Input disabled={disabled} placeholder={intl.get('PLEASE_ENTER_NAME')} />
    </FormInputItem>
  );
};
