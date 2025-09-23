import * as React from 'react';
import { getProjectStatistics, ProjectStatistics } from '../../asset-common';

export function useProjectStatistics() {
  const [projectStatistics, setProjectStatistics] = React.useState<ProjectStatistics | undefined>();
  React.useEffect(() => {
    getProjectStatistics().then(setProjectStatistics);
  }, []);
  return projectStatistics;
}
