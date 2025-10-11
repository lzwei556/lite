import { useSelectedProject } from '../providers/user-profile';

export const ASSET_PATHNAME = 'assets';

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
