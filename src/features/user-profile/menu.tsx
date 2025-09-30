import { Menu as AntdMenu, MenuProps } from 'antd';
import intl from 'react-intl-universal';
import { Menu } from '../../types/menu';
import { FontIcon, Link } from '../../components';
import { useRequest } from 'ahooks';
import request from '../../utils/request';
import { useLocation } from 'react-router-dom';
import { mapTree } from '../../utils/tree';
import { ASSET_PATHNAME } from '../../asset-common';

// UI related logic begin

export const MenuNavigator = (props: MenuProps) => {
  return <AntdMenu {...props} {...useMenuProps(transform, { MenuItemLable, MenuItemIcon })} />;
};

const transform: TransformFn = (props) => {
  const { menu, MenuItemLable, MenuItemIcon } = props;
  const { name, icon, sort, children } = menu;
  const item = {
    key: name,
    label: <MenuItemLable menu={menu} />,
    icon: icon && <MenuItemIcon menu={menu} />,
    sort
  };
  if (children && children.length > 0) {
    return {
      ...item,
      children: children.sort((prev, next) => (prev.sort || 0) - (next.sort || 0))
    };
  }
  return item;
};

const MenuItemLable = ({ menu }: { menu: Menu }) => {
  const { name, path, title } = menu;
  const intlTitle = intl.get(title);
  return path ? <Link to={`${name}`}>{intlTitle}</Link> : intlTitle;
};

const MenuItemIcon = ({ menu: { icon } }: { menu: Menu }) => {
  return icon && <FontIcon classNames={[icon, 'ant-menu-item-icon']} />;
};
// UI related logic end

// props begin
type TransformFn = (props: {
  menu: Menu;
  MenuItemLable: React.ComponentType<{
    menu: Menu;
  }>;
  MenuItemIcon: React.ComponentType<{
    menu: Menu;
  }>;
}) => NonNullable<MenuProps['items']>[0];

const useMenuProps = (
  transformFn: TransformFn,
  paras: Omit<Parameters<TransformFn>[0], 'menu'>
): MenuProps => {
  const { pathname } = useLocation();
  const paths = pathname
    .split('/')
    .filter((p) => p.length > 0)
    .filter((p) => Number.isNaN(Number(p)));
  const selectedKeys = paths.length > 0 ? paths : [ASSET_PATHNAME];
  const { data } = useMyMenus();
  return {
    items: data ? mapTree(data, (menu) => transformFn({ menu, ...paras })) : [],
    selectedKeys
  };
};
// props end

// state begin
const useMyMenus = () => useRequest(getMyMenus);
// state end

// api begin
const getMyMenus = async () => {
  const res = await request.get<Menu[]>('/my/menus');
  return res.data.data;
};
// api end
