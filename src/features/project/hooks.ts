import { useGetIdentity } from 'providers/auth';
import { ProfileContext, useInit } from 'providers/user-profile';
import React from 'react';
import { GlobalStore } from 'utils';

const store = GlobalStore.getInstance(true);

export const useUpdateMyProjects = () => {
  const { init } = useInit(React.useContext(ProfileContext).setProjects);
  const crtUser = useGetIdentity();

  return React.useCallback(
    (user_ids: number[]) => {
      if (crtUser && user_ids.includes(crtUser.id)) {
        init();
      }
    },
    [crtUser, init]
  );
};

export const useDeleteProject = () => {
  const { selectedProject, projects, setProjects, changeProject } =
    React.useContext(ProfileContext);
  const { init } = useInit(setProjects, changeProject);
  return React.useCallback(
    (id: number) => {
      if (selectedProject?.id === id) {
        store.remove('selectedProjectId');
        return init();
      } else if (projects.map((p) => p.id).includes(id)) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    },
    [selectedProject?.id, projects, init, setProjects]
  );
};
