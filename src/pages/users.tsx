import { ResourceTable, useResourceList, useResourceQuery } from 'resource';
import { Content } from 'antd/es/layout/layout';
import { Typography } from 'antd';
import { Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateFormModal, UpdateFormModal } from 'features/user';
import {
  ACCOUNT_SUPER_ADMIN,
  create,
  deleteOne,
  Fields,
  getList,
  transform,
  update
} from 'domain/user';
import { ProfileContext } from 'providers/user-profile';

export default function Users() {
  const query = useResourceQuery();
  const list = useResourceList(getList, query.query);
  const { roles } = React.useContext(ProfileContext);
  const transformedList = React.useMemo(() => {
    if (!list.data || roles.length === 0) {
      return [];
    }
    return list.data.result.map((u) => {
      const user = transform(u, roles);
      return { ...user, roleText: user.roleText ? intl.get(user.roleText) : '' };
    });
  }, [list.data, roles]);

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_USER_MANAGEMENT')}</Typography.Title>
      <ResourceTable
        columns={[
          Fields.Username,
          Fields.Phone,
          Fields.Email,
          { name: 'roleText', label: 'ROLE' }
        ].map((field) => ({
          dataIndex: field.name,
          title: intl.get(field.label)
        }))}
        actionController={{
          api: { create, update, delete: deleteOne },
          actions: {
            create: {
              can: useCan(Permission.UserAdd),
              modal: (ctx) => <CreateFormModal {...ctx} />,
              onSuccess: () => list.handleCreated(query.setQuery)
            },
            update: {
              can: useCan(Permission.UserEdit),
              modal: (ctx) => <UpdateFormModal {...ctx} />,
              hidden: (user) => user.id === ACCOUNT_SUPER_ADMIN.id,
              onSuccess: list.refresh
            },
            delete: {
              can: useCan(Permission.UserDelete),
              onSuccess: () => list.handleDeleted(query.setQuery),
              hidden: (user) => user.id === ACCOUNT_SUPER_ADMIN.id
            }
          }
        }}
        list={{ ...list, data: transformedList }}
        queryController={query}
      />
    </Content>
  );
}
