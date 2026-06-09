import { SelectFormItem } from 'components';
import { Fields } from 'domains/user';
import { ProfileContext } from 'providers/user-profile';
import React from 'react';
import intl from 'react-intl-universal';

export const RolesSelectFormItem = () => {
  const field = Fields.Role;
  const { roles } = React.useContext(ProfileContext);
  return (
    <SelectFormItem
      {...field}
      selectProps={{
        options: roles.map(({ id, name }) => ({
          label: intl.get(name),
          value: id
        }))
      }}
    />
  );
};
