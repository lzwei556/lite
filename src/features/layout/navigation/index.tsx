import { MenuProps, Menu as AntdMenu } from 'antd';
import { Link } from 'components';
import { AssetTree } from 'domains/asset';
import { Menu } from 'domains/menu';
import { useMyMenus } from 'domains/profile';
import React from 'react';
import intl from 'react-intl-universal';
import { useLocation } from 'react-router-dom';
import { FontIcon } from './fontIcon';

export const Navigation = (props: MenuProps) => {
  const location = useLocation();

  const { items, selectedKeys } = useNavigationMenu();

  return (
    <AntdMenu
      key={location.pathname}
      mode='horizontal'
      items={items}
      selectedKeys={selectedKeys}
      {...props}
    />
  );
};

const useNavigationMenu = () => {
  const { pathname } = useLocation();

  const { data } = useMyMenus();

  const items = React.useMemo<MenuProps['items']>(() => {
    if (!data) return [];

    return buildMenuItems(data);
  }, [data]);

  const selectedKeys = React.useMemo(() => {
    const root =
      pathname
        .split('/')
        .filter(Boolean)
        .find((p) => Number.isNaN(Number(p))) ?? AssetTree.Path.Assets;

    return [root];
  }, [pathname]);

  return {
    items,
    selectedKeys
  };
};

const buildMenuItems = (menus: Menu[]): MenuProps['items'] => {
  return menus
    .slice()
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map(toMenuItem);
};

const toMenuItem = (menu: Menu): Required<MenuProps>['items'][number] => {
  return {
    key: menu.name,
    label: menu.path ? (
      <Link to={`/${menu.name}`}>{intl.get(menu.title)}</Link>
    ) : (
      intl.get(menu.title)
    ),
    icon: menu.icon ? <FontIcon classNames={[menu.icon, 'ant-menu-item-icon']} /> : undefined,
    children: menu.children && menu.children.length > 0 ? buildMenuItems(menu.children) : undefined
  };
};
