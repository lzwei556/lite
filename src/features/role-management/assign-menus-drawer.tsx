import { Drawer, DrawerProps, Tree, Spin } from 'antd';
import { useState } from 'react';
import { ActionModalContext, createSubmitHandler, useDataFetch } from 'resource';
import { get, MenuAssignmentData, Role } from 'domains/role';
import intl from 'react-intl-universal';
import { CanAccess, Permission } from 'providers/access-control';
import { SaveIconButton } from 'components';
import { useMenusTree } from './hooks';

export const AssginMenusDrawer = ({
  record,
  open,
  close,
  loading,
  submit,
  ...rest
}: DrawerProps & ActionModalContext<Role, MenuAssignmentData>) => {
  const [checkedMenuIds, setCheckedMenuIds] = useState<React.Key[]>([]);
  const { data: role } = useDataFetch(() => get({ id: record!.id }), { ready: !!record });
  const { treeData, defaultCheckedKeys, loading: treeLoading, isEmpty } = useMenusTree(role);

  const onSave = () => {
    if (!role) return;
    createSubmitHandler(submit, close)({ id: role.id, menuIds: checkedMenuIds as number[] });
  };

  return (
    role && (
      <Drawer
        {...rest}
        extra={
          // <CanAccess {...Permission.RoleAllocMenus}> // 目前权限控制不完善
          <CanAccess {...Permission.RoleList}>
            <SaveIconButton loading={loading} onClick={onSave} size='small' />
          </CanAccess>
        }
        open={open}
        onClose={close}
        placement='right'
        title={intl.get(role.name).d(role.name)}
      >
        {open && (
          <Spin spinning={treeLoading}>
            {!isEmpty && (
              <Tree
                checkable={true}
                defaultCheckedKeys={defaultCheckedKeys}
                defaultExpandAll={true}
                onCheck={(checked, e) =>
                  setCheckedMenuIds(
                    (checked as React.Key[]).concat(e.halfCheckedKeys as React.Key[])
                  )
                }
                selectable={false}
                showIcon={true}
                treeData={treeData}
              />
            )}
          </Spin>
        )}
      </Drawer>
    )
  );
};
