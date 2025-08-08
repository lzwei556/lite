import { useCallback, useEffect, useState } from 'react';
import { Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import intl from 'react-intl-universal';
import { GetRoleRequest, PagingRolesRequest } from '../../../apis/role';
import { Role } from '../../../types/role';
import { Link, Table, transformPagedresult } from '../../../components';
import usePermission, { Permission } from '../../../permission/permission';
import { PageResult } from '../../../types/page';
import AddRoleModal from './modal/add';
import EditRoleModal from './modal/edit';
import MenuDrawer from './menuDrawer';
import PermissionDrawer from './permissionDrawer';

const RolePage = () => {
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(false);
  const [role, setRole] = useState<Role>();
  const [dataSource, setDataSource] = useState<PageResult<any>>();
  const [refreshKey, setRefreshKey] = useState(0);
  const { hasPermission } = usePermission();

  const fetchRoles = useCallback((current: number, size: number) => {
    PagingRolesRequest(current, size).then(setDataSource);
  }, []);

  useEffect(() => {
    fetchRoles(1, 10);
  }, [fetchRoles]);

  const onRefresh = () => {
    setRefreshKey(refreshKey + 1);
  };

  const onAllocMenus = (id: number) => {
    GetRoleRequest(id).then((data) => {
      setRole(data);
      setMenuVisible(true);
    });
  };

  const columns = [
    {
      title: intl.get('ROLE_NAME'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => intl.get(name)
    },
    {
      title: intl.get('ROLE_DESCRIPTION'),
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => intl.get(description)
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (_: string, record: any) => {
        return (
          hasPermission(Permission.RoleAllocMenus) && (
            <Link onClick={() => onAllocMenus(record.id)} variant='button'>
              {intl.get('ASSIGN_MENU')}
            </Link>
          )
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_ROLE_MANAGEMENT')}</Typography.Title>
      <Table
        columns={columns}
        dataSource={ds}
        pagination={{
          ...paged,
          onChange: fetchRoles
        }}
        rowKey={(row) => row.id}
      />
      <AddRoleModal
        open={addVisible}
        onCancel={() => setAddVisible(false)}
        onSuccess={() => {
          setAddVisible(false);
          onRefresh();
        }}
      />
      {role && (
        <EditRoleModal
          role={role}
          open={editVisible}
          onCancel={() => setEditVisible(false)}
          onSuccess={() => {
            setEditVisible(false);
            onRefresh();
          }}
        />
      )}
      {role && <MenuDrawer role={role} open={menuVisible} onCancel={() => setMenuVisible(false)} />}
      {role && (
        <PermissionDrawer
          role={role}
          open={permissionVisible}
          onCancel={() => setPermissionVisible(false)}
        />
      )}
    </Content>
  );
};

export default RolePage;
