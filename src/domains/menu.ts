import request from 'utils/request';

export type Menu = {
  id: number;
  title: string;
  name: string;
  path: string;
  hidden: boolean;
  isAuth: boolean;
  icon: string;
  view: string;
  children?: Menu[];
  sort?: number;
};

export const getTree = async () => {
  return await request.get<Menu[]>('/menus/tree');
};
