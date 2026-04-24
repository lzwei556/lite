import React from 'react';
import { Project } from '../types/project';
import { Result, SelectProps, Spin } from 'antd';
import { GlobalStore } from '../utils/global-store';
import intl from 'react-intl-universal';
import * as ProjectType from 'domain/project-type';
import { getMyProject, getMyProjects } from 'domain/profile';
import { getList, Role } from 'domain/role';
import { usePaginationList } from 'hooks/data';
import { transform } from 'types/page';

const store = GlobalStore.getInstance(true);

export const ProjectVerification = ({ children }: { children: React.ReactNode }) => {
  const selectedProject = useSelectedProject();
  return selectedProject ? (
    <React.Fragment key={selectedProject.id}>{children}</React.Fragment>
  ) : (
    <Result status='500' title={intl.get('no.available.project')} />
  );
};

export const useSelectedProject = () => {
  const { selectedProject } = React.useContext(ProfileContext);
  return selectedProject;
};

export const ProfileContext = React.createContext<{
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedProject?: Project;
  changeProject: (id: number) => void;
  roles: Role[]; //因为roles是在服务器端自动生成，并且用户无法自定义，所以可以当作是profile
}>({
  projects: [],
  setProjects: () => {},
  selectedProject: undefined,
  changeProject: () => {},
  roles: []
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { projects, setProjects, loading, selectedProjectId, setSelectedProjectId } =
    useInitSelectedProject();
  const selectedProject = projects.find(
    (p) => p.id === (selectedProjectId ?? store.get('selectedProjectId'))
  );
  const { data } = usePaginationList(getList, { syncUrl: false });
  return (
    <ProfileContext.Provider
      value={{
        projects,
        setProjects,
        selectedProject,
        changeProject: setSelectedProjectId,
        roles: transform(data).list
      }}
    >
      <Spin spinning={loading}>{!loading && children}</Spin>
    </ProfileContext.Provider>
  );
};

const useInitSelectedProject = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<number>();
  const { init, loading } = useInit(setProjects, setSelectedProjectId);
  React.useEffect(() => {
    init();
  }, [init]);
  return { loading, projects, setProjects, selectedProjectId, setSelectedProjectId };
};

export const useDeleteProject = () => {
  const { setProjects, changeProject } = React.useContext(ProfileContext);
  const { init } = useInit(setProjects, changeProject);
  return React.useCallback(() => {
    store.remove('selectedProjectId');
    return init();
  }, [init]);
};

export const useInit = (
  setProjects: (projects: Project[]) => void,
  setSelectedProjectId?: (id: number) => void
) => {
  const [loading, setLoading] = React.useState(true);
  const init = React.useCallback(async () => {
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [setProjects, setSelectedProjectId]);
  return { init, loading };
};

export const useProjectsSelectProps = (onSuccess: () => void): SelectProps | undefined => {
  const { projects, selectedProject, changeProject } = React.useContext(ProfileContext);
  return selectedProject
    ? {
        defaultValue: selectedProject?.id,
        options: projects.map((p) => ({ label: p.name, value: p.id })),
        onChange: (id) => {
          getMyProject(id).then((project) => {
            changeProject(project.id);
            store.set('selectedProjectId', project.id);
            onSuccess();
          });
        },
        popupMatchSelectWidth: false,
        value: selectedProject?.id,
        variant: 'borderless'
      }
    : undefined;
};

export const useAppTypeMappingWithSelectedProject = () => {
  const selectedProject = useSelectedProject();
  const projectType = selectedProject?.type;
  if (projectType) {
    return ProjectType.getAppType(projectType as unknown as ProjectType.Enum);
  }
};
