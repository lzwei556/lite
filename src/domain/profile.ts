import { useRequest } from 'ahooks';
import { GlobalStore } from 'utils';
import request from 'utils/request';
import { DTO, Project, transform } from './project';
import { Menu } from './menu';

export type AuthIdentity = { id: number; username: string; role: number };

const store = GlobalStore.getInstance(true);

export const getMyProjects = async () => {
  const data = await request.get<DTO[]>('/my/projects');
  return data.map(transform);
};

export const getMyProject = async (id: number) => {
  return request.get<Project>(`/my/projects/${id}`);
};

export const getIndentity = async () => {
  return request.get<AuthIdentity>('/my/profile');
};

export const useMyMenus = () => useRequest(getMyMenus);

const getMyMenus = async () => {
  return request.get<Menu[]>('/my/menus');
};

type CanResponse = { rules: string };

export const getMyCasbin = async () => {
  return request.get<CanResponse>(`/my/casbin`);
};

export const getInitFn = (
  setProjects: (projects: Project[]) => void,
  setSelectedProjectId?: (id: number) => void,
  cb?: () => void
) => {
  return async () => {
    try {
      const projects = await getMyProjects();
      if (projects && projects.length > 0) {
        setProjects(projects);
        if (!store.get('selectedProjectId') && setSelectedProjectId) {
          const project = await getMyProject(projects[0].id);
          if (project) {
            setSelectedProjectId(project.id);
            store.set('selectedProjectId', project.id);
            return Promise.resolve('success');
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      cb?.();
    }
  };
};
