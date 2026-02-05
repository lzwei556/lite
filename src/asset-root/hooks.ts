import { getProjectStatistics, ProjectStatistics } from 'asset-common';
import { useSelectedProject } from 'providers/user-profile';
import React from 'react';

export function useProjectStatistics() {
  const [projectStatistics, setProjectStatistics] = React.useState<ProjectStatistics | undefined>();
  React.useEffect(() => {
    getProjectStatistics().then(setProjectStatistics);
  }, []);
  return projectStatistics;
}

export const useVirturalAsset = () => {
  const selectedProject = useSelectedProject();
  const root = {
    id: 0,
    type: 0,
    name: selectedProject?.name
  };
  const homePathId = `${root.id}-${root.type}`;
  return { root, homePathId };
};
