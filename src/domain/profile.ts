import { useRequest } from 'ahooks';
import request from 'utils/request';
import { DTO, Project, transform } from './project';
import { Menu } from './menu';
import { User } from './user';

export const updateProfile = async (params: Partial<Pick<User, 'phone' | 'email'>>) => {
  return request.patch<User>('/my/profile', params);
};

export const getMyProjects = async () => {
  const data = await request.get<DTO[]>('/my/projects');
  return data.map(transform);
};

export const getMyProject = async (id: number) => {
  return request.get<Project>(`/my/projects/${id}`);
};

export const useMyMenus = () => useRequest(getMyMenus);

const getMyMenus = async () => {
  return request.get<Menu[]>('/my/menus');
};

type CanResponse = { rules: string };

export const getMyCasbin = async () => {
  return request.get<CanResponse>(`/my/casbin`);
};
