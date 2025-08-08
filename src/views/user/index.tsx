import { useEffect, useState } from 'react';
import { Button, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { UserAddOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { DeleteIconButton, EditIconButton, Table, transformPagedresult } from '../../components';
import { PagingUsersRequest, RemoveUserRequest } from '../../apis/user';
import { User } from '../../types/user';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { PageResult } from '../../types/page';
import { Store, useStore } from '../../hooks/store';
import { AddUserModal } from './add';
import { EditUserModal } from './edit';
import { useRoles } from './use-roles';

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
      title: intl.get('USERNAME'),
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: intl.get('CELLPHONE'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: intl.get('EMAIL'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: intl.get('ROLE'),
      dataIndex: 'role',
      render: (roleId: number) => {
        const role = roles.find((role) => role.id === roleId);
        return role?.name ? intl.get(role?.name) : '';
      },
      key: 'role'
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (_: string, record: User) => {
        return (
          record.id !== 1 && (
            <Space>
              <HasPermission value={Permission.UserEdit}>
                <EditIconButton
                  onClick={() => {
                    setUser(record);
                    setOpen(true);
                  }}
                />
              </HasPermission>
              <HasPermission value={Permission.UserDelete}>
                <DeleteIconButton
                  confirmProps={{
                    description: intl.get('DELETE_USER_PROMPT'),
                    onConfirm: () => onDelete(record.id)
                  }}
                />
              </HasPermission>
            </Space>
          )
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_USER_MANAGEMENT')}</Typography.Title>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          toolbar: [
            <HasPermission value={Permission.UserAdd}>
              <Button type='primary' onClick={() => setOpen(true)}>
                {intl.get('CREATE_USER')} <UserAddOutlined />
              </Button>
            </HasPermission>
          ]
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
