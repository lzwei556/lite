import React from 'react';
import { Translation } from 'locales/utils';
import { Role } from '../../types/role';
import { PagingRolesRequest } from '../../apis/role';

export const useRoleSelectProps = () => {
  const roles = useRoles();
  return {
    options: roles.map((role) => ({ label: Translation.get(role.name), value: role.id }))
  };
};

export const useRoles = () => {
  const [roles, setRoles] = React.useState<Role[]>([]);

  React.useEffect(() => {
    PagingRolesRequest(1, 100).then((data) => {
      setRoles(data.result);
    });
  }, []);
  return roles;
};
