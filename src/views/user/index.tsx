import { useEffect, useState } from 'react';
import { Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Translation } from 'locales/utils';
import {
  DeleteIconButton,
  EditIconButton,
  IconButton,
  Table,
  transformPagedresult
} from '../../components';
import { PagingUsersRequest, RemoveUserRequest } from '../../apis/user';
import { User } from '../../types/user';
import { PageResult } from '../../types/page';
import { Store, useStore } from '../../hooks/store';
import { AddUserModal } from './add';
import { EditUserModal } from './edit';
import { useRoles } from './use-roles';
import { UserAddOutlined } from '@ant-design/icons';
import { CanAccess, Permission } from '../../providers/access-control';

const UserPage = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const [dataSource, setDataSource] = useState<PageResult<User[]>>();
  const [store, setStore, gotoPage] = useStore('accountList');
  const roles = useRoles();

  const fetchUsers = (store: Store['accountList']) => {
    const {
      pagedOptions: { index, size }
    } = store;
    PagingUsersRequest(index, size).then(setDataSource);
  };

  useEffect(() => {
    fetchUsers(store);
  }, [store]);

  const onAddUserSuccess = () => {
    reset();
    if (dataSource) {
      const { size, page, total } = dataSource;
      gotoPage({ size, total, index: page }, 'next');
    }
  };

  const reset = () => {
    setUser(undefined);
    setOpen(false);
  };

  const onDelete = (id: number) => {
    RemoveUserRequest(id).then((_) => {
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
    });
  };

  const columns = [
    {
      title: Translation.get('auth.username'),
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: Translation.get('common.mobile.phone'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: Translation.get('common.email'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: Translation.get('auth.role'),
      dataIndex: 'role',
      render: (roleId: number) => {
        const role = roles.find((role) => role.id === roleId);
        return role?.name ? Translation.get(role?.name) : '';
      },
      key: 'role'
    },
    {
      title: Translation.get('common.operation'),
      key: 'action',
      render: (_: string, record: User) => {
        return (
          record.id !== 1 && (
            <Space>
              <CanAccess {...Permission.UserEdit}>
                <EditIconButton
                  onClick={() => {
                    setUser(record);
                    setOpen(true);
                  }}
                />
              </CanAccess>
              <CanAccess {...Permission.UserDelete}>
                <DeleteIconButton
                  confirmProps={{
                    description: Translation.get('feedback.prompt.delete'),
                    onConfirm: () => onDelete(record.id)
                  }}
                />
              </CanAccess>
            </Space>
          )
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Content>
      <Typography.Title level={4}>{Translation.get('MENU_USER_MANAGEMENT')}</Typography.Title>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          toolbar: (
            <CanAccess {...Permission.UserAdd}>
              <IconButton
                icon={<UserAddOutlined />}
                onClick={() => setOpen(true)}
                tooltipProps={{ title: Translation.createSth('label.user') }}
                type='primary'
              />
            </CanAccess>
          )
        }}
        pagination={{
          ...paged,
          onChange: (index, size) =>
            setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
        }}
        rowKey={(row) => row.id}
      />
      {user ? (
        <EditUserModal
          user={user}
          open={open}
          onCancel={reset}
          onSuccess={() => {
            reset();
            fetchUsers(store);
          }}
        />
      ) : (
        <AddUserModal open={open} onCancel={reset} onSuccess={onAddUserSuccess} />
      )}
    </Content>
  );
};

export default UserPage;
