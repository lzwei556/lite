import { useEffect, useState } from 'react';
import { Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Table, transformPagedresult } from '../../components';
import { GetUserRequest, PagingUsersRequest, RemoveUserRequest } from '../../apis/user';
import { InitializeUserState, User } from '../../types/user';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { PageResult } from '../../types/page';
import { Store, useStore } from '../../hooks/store';
import { Role } from '../../types/role';
import { PagingRolesRequest } from '../../apis/role';
import AddUserModal from './add';
import EditUserModal from './edit';

const UserPage = () => {
  const [addUserVisible, setAddUserVisible] = useState<boolean>(false);
  const [editUserVisible, setEditUserVisible] = useState<boolean>(false);
  const [user, setUser] = useState(InitializeUserState);
  const [dataSource, setDataSource] = useState<PageResult<User[]>>();
  const [store, setStore, gotoPage] = useStore('accountList');
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchUsers = (store: Store['accountList']) => {
    const {
      pagedOptions: { index, size }
    } = store;
    PagingUsersRequest(index, size).then(setDataSource);
  };

  useEffect(() => {
    PagingRolesRequest(1, 100).then((data) => {
      setRoles(data.result);
    });
  }, []);

  useEffect(() => {
    fetchUsers(store);
  }, [store]);

  const onAddUserSuccess = () => {
    setAddUserVisible(false);
    if (dataSource) {
      const { size, page, total } = dataSource;
      gotoPage({ size, total, index: page }, 'next');
    }
  };

  const onEdit = async (id: number) => {
    GetUserRequest(id).then((data) => {
      setUser(data);
      setEditUserVisible(true);
    });
  };

  const onEditUserSuccess = () => {
    setEditUserVisible(false);
    fetchUsers(store);
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
      render: (text: any, record: any) => {
        if (record.id === 1) {
          return <div />;
        }
        return (
          <Space>
            <HasPermission value={Permission.UserEdit}>
              <Button
                type='text'
                size='small'
                icon={<EditOutlined />}
                onClick={() => onEdit(record.id)}
              />
            </HasPermission>
            <HasPermission value={Permission.UserDelete}>
              <Popconfirm
                placement='left'
                title={intl.get('DELETE_USER_PROMPT')}
                onConfirm={() => onDelete(record.id)}
                okText={intl.get('DELETE')}
                cancelText={intl.get('CANCEL')}
              >
                <Button type='text' size='small' icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </HasPermission>
          </Space>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          title: intl.get('MENU_USER_MANAGEMENT'),
          toolbar: [
            <HasPermission value={Permission.UserAdd}>
              <Button type='primary' onClick={() => setAddUserVisible(true)}>
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
      <AddUserModal
        open={addUserVisible}
        onCancel={() => setAddUserVisible(false)}
        onSuccess={onAddUserSuccess}
      />
      <EditUserModal
        user={user}
        open={editUserVisible}
        onCancel={() => setEditUserVisible(false)}
        onSuccess={onEditUserSuccess}
      />
    </>
  );
};

export default UserPage;
