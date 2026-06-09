import {
  createActionState,
  ResourceTable,
  useDataFetch,
  useResourceList,
  ActionConfig
} from 'resource';
import React, { useMemo } from 'react';
import { Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import intl from 'react-intl-universal';
import { Link } from 'components';
import { Permission, useCan } from 'providers/access-control';
import { assignMenus, getList } from 'domains/role';
import { AssginMenusDrawer } from 'features/role-management';

// Extract action state management logic
const useAssignMenusActionState = () => {
  return createActionState(
    useDataFetch(assignMenus, {
      manual: true,
      onSuccess: ({ messageInstance }) => {
        messageInstance?.success('save.success');
      }
    })
  );
};

export default function Roles() {
  const list = useResourceList(getList);
  const assignMenusState = useAssignMenusActionState();
  // const canAssignMenus = useCan(Permission.RoleAllocMenus); // 目前权限控制不完善
  const canAssignMenus = useCan(Permission.RoleList);

  const actionConfig: Record<string, ActionConfig> = useMemo(
    () => ({
      assignMenu: {
        position: 'row' as const,
        can: canAssignMenus,
        modal: (ctx) => <AssginMenusDrawer {...ctx} />,
        render: (ctx) => (
          <Link onClick={() => ctx.open('assignMenu', ctx.record)} variant='button'>
            {intl.get('ASSIGN_MENU')}
          </Link>
        ),
        state: assignMenusState
      }
    }),
    [assignMenusState, canAssignMenus]
  );

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_ROLE_MANAGEMENT')}</Typography.Title>
      <ResourceTable
        columns={[
          {
            dataIndex: 'name',
            title: intl.get('ROLE_NAME'),
            render: (value: string) => intl.get(value).d(value)
          },
          {
            dataIndex: 'description',
            title: intl.get('ROLE_DESCRIPTION'),
            render: (value: string) => intl.get(value).d(value)
          }
        ]}
        actionController={{ actions: actionConfig }}
        list={list}
      />
    </Content>
  );
}
