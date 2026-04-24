import { TableWithOperations } from 'components';
import { Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateFormModal } from './create-form-modal';
import { UpdateFormModal } from './update-form-modal';
import { ACCOUNT_SUPER_ADMIN, create, deleteOne, Fields, getList, update, User } from 'domain/user';
import { createActionState, useCreate, useDelete, usePaginationList, useUpdate } from 'hooks/data';
import { Content } from 'antd/es/layout/layout';
import { TableColumnsType, Typography } from 'antd';
import { ProfileContext } from 'providers/user-profile';

export default function Users() {
  const list = usePaginationList(getList);
  const { roles } = React.useContext(ProfileContext);

  const createState = createActionState(
    useCreate(create, {
      onSuccess: () => {
        list.search('next');
      }
    })
  );
  const updateState = createActionState(
    useUpdate(update, {
      onSuccess: () => {
        list.refresh();
      }
    })
  );
  const deleteState = createActionState(
    useDelete(deleteOne, { onSuccess: () => list.search('prev') })
  );

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_USER_MANAGEMENT')}</Typography.Title>
      <TableWithOperations
        columns={(
          [Fields.Username, Fields.Phone, Fields.Email].map((field) => ({
            dataIndex: field.name,
            title: intl.get(field.label)
          })) as TableColumnsType<User>
        ).concat([
          {
            dataIndex: Fields.Role.name,
            title: intl.get(Fields.Role.label),
            render: (id: number) => Fields.Role.valueToLabel?.(id, roles)
          }
        ])}
        listProps={{
          dataSource: list.data,
          actions: {
            create: {
              can: useCan(Permission.UserAdd),
              modal: ({ open, close }) => <CreateFormModal {...{ open, close, ...createState }} />
            },
            update: {
              can: useCan(Permission.UserEdit),
              modal: ({ open, close, record }) => (
                <UpdateFormModal {...{ open, close, ...updateState, user: record }} />
              )
            },
            delete: { can: useCan(Permission.UserDelete), state: deleteState }
          }
        }}
        pagination={list.pagination}
        hideOperateionCell={(user) => user.id === ACCOUNT_SUPER_ADMIN.id}
      />
    </Content>
  );
}
