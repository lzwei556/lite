import { Button, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { GetRoleRequest, PagingRolesRequest } from '../../../apis/role';
import { Role } from '../../../types/role';
import { Table, transformPagedresult } from '../../../components';
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

  const fetchRoles = useCallback((current, size) => {
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
      render: (text: string, record: any) => {
        return intl.get(record.name);
      }
    },
    {
      title: intl.get('ROLE_DESCRIPTION'),
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: any) => {
        return intl.get(record.description);
      }
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      width: '25%',
      render: (text: string, record: any) => {
        return (
          <Space>
            {hasPermission(Permission.RoleAllocMenus) && (
              <Button
                type={'link'}
                size={'small'}
                onClick={() => {
                  onAllocMenus(record.id);
                }}
              >
                {intl.get('ASSIGN_MENU')}
              </Button>
            )}
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
          title: intl.get('MENU_USER_MANAGEMENT')
        }}
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
    </>
  );
};

export default RolePage;
