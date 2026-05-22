import { Content } from 'antd/es/layout/layout';
import { Typography } from 'antd';
import { ResourceTable } from 'components';
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
import { usePaginationList } from 'hooks/data';
import { ProfileContext } from 'providers/user-profile';

export default function Users() {
  const list = usePaginationList(getList);
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
          { name: 'roleText', label: intl.get('ROLE') }
        ].map((field) => ({
          dataIndex: field.name,
          title: intl.get(field.label)
        }))}
        actionController={{
          list: { ...list, data: transformedList },
          api: { create, update, delete: deleteOne },
          actions: {
            create: {
              can: useCan(Permission.UserAdd),
              modal: (ctx) => <CreateFormModal {...ctx} />,
              onSuccess: () => list.search('next')
            },
            update: {
              can: useCan(Permission.UserEdit),
              modal: (ctx) => <UpdateFormModal {...ctx} />,
              hidden: (user) => user.id === ACCOUNT_SUPER_ADMIN.id
            },
            delete: {
              can: useCan(Permission.UserDelete),
              onSuccess: () => list.search('prev'),
              hidden: (user) => user.id === ACCOUNT_SUPER_ADMIN.id
            }
          }
        }}
        pagination={list.pagination}
      />
    </Content>
  );
}
