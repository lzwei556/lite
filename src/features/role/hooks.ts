import React, { useEffect, useMemo, useState } from 'react';
import { useList } from 'hooks/data';
import { getTree, Menu } from 'domain/menu';
import intl from 'react-intl-universal';
import { Role } from 'domain/role';

interface MenusTreeReturn {
  treeData: any[];
  defaultCheckedKeys: React.Key[];
  loading: boolean;
  isEmpty: boolean;
}

export const useMenusTree = (role?: Role): MenusTreeReturn => {
  const { list: menus, loading } = useList(getTree, {
    ready: !!role
  });

  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (menus.length > 0 && role) {
      const topMenuIds = menus.filter((menu) => menu.path.length === 0).map((menu) => menu.id);
      const targetMenuIds = (role.menus ?? []).filter((id) => !topMenuIds.includes(id));
      setDefaultCheckedKeys(targetMenuIds);
    }
  }, [menus, role]);

  const treeData = useMemo(() => {
    const convertTreeData = (children: Menu[]): any[] =>
      children
        .filter((item) => !item.hidden)
        .map((menu) => ({
          title: intl.get(menu.title).d(menu.title),
          key: menu.id,
          icon: menu.icon
            ? React.createElement('span', { className: `iconfont ${menu.icon}` })
            : undefined,
          children: menu.children ? convertTreeData(menu.children) : undefined
        }));

    return convertTreeData(menus);
  }, [menus]);

  return {
    treeData,
    defaultCheckedKeys,
    loading,
    isEmpty: menus.length === 0
  };
};
