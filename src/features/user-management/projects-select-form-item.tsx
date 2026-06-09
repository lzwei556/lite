import { SelectFormItem } from 'components';
import { Fields } from 'domains/user';
import { ProfileContext } from 'providers/user-profile';
import React from 'react';

export const ProjectsSelectFormItem = () => {
  const field = Fields.Projects;
  const { projects } = React.useContext(ProfileContext);
  return (
    <SelectFormItem
      {...field}
      selectProps={{
        mode: 'multiple',
        options: projects.map(({ id, name }) => ({
          label: name,
          value: id
        }))
      }}
    />
  );
};
