import { useRequest } from 'ahooks';
import request from '../../utils/request';
import { Menu } from '../../types/menu';
import { Menu as AntdMenu, MenuProps } from 'antd';
import { mapTree } from '../../utils/tree';
import intl from 'react-intl-universal';
import { Link } from '../../components';
import { useLocation } from 'react-router-dom';
import { ASSET_PATHNAME } from '../../asset-common';

const getMyMenus = () => {
  return request.get<Menu[]>('/my/menus').then((res) => res.data.data);
};

const useMyMenus = () => useRequest(getMyMenus);

const useMenuProps = (): MenuProps => {
  const { pathname } = useLocation();
  const paths = pathname
    .split('/')
    .filter((p) => p.length > 0)
    .filter((p) => Number.isNaN(Number(p)));
  const selectedKeys = paths.length > 0 ? paths : [ASSET_PATHNAME];
  const { data } = useMyMenus();
  return { items: getMenuItems(data ?? []), selectedKeys };
};

const getMenuItems = (menu: Menu[]): MenuProps['items'] => {
  return mapTree(menu, (m) => {
    const label = m.path ? <Link to={`${m.name}`}>{intl.get(m.title)}</Link> : intl.get(m.title);
    const key = m.name;
    const icon = m.icon ? <span className={`iconfont ${m.icon}`} /> : null;
    if (m.children && m.children.length > 0) {
      return { label, key, icon, sort: m.sort, children: m.children.sort(sortMenus) };
    } else {
      return { label, key, icon, sort: m.sort };
    }
  });
};

const sortMenus = (prev: Menu, next: Menu) => {
  return (prev.sort || 0) - (next.sort || 0);
};

export const MenuNavigator = (props: MenuProps) => {
  return <AntdMenu {...props} {...useMenuProps()} />;
};
