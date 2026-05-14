import { PageParameter, PageResult } from 'types/page';
import request from 'utils/request';

export type Role = {
  id: number;
  name: string;
  description: string;
  menus?: number[];
  permissions?: string[][];
};

export const getList = async (param: PageParameter) => {
  return request.get<PageResult<Role>>('/roles', param);
};
