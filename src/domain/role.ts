import request from 'utils/request';
import { PageParameter, PageResult } from 'types/page';

export type Role = {
  id: number;
  name: string;
  description: string;
  menus?: number[];
  permissions?: string[][];
};

export type MenuAssignmentData = { id: number; menuIds: number[] };

export const get = async ({ id }: { id: number }) => {
  return request.get<Role>(`/roles/${id}`);
};

export const getList = async (param: PageParameter) => {
  return request.get<PageResult<Role>>('/roles', param);
};

export const assignMenus = async ({ id, menuIds }: MenuAssignmentData) => {
  return request.patch(`/roles/${id}/menus`, { ids: menuIds });
};
