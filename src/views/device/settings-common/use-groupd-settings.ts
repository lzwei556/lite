import { DeviceSetting, GROUPS } from './common';

export const useGroupedSettings = (settings: DeviceSetting[]) => {
  return getGroups(settings).map((group) => {
    const groupedSettings = settings
      .filter((setting) => setting.group === group)
      .sort((prev, next) => prev.sort - next.sort);
    return { group: getGroupName(group), settings: groupedSettings };
  });
};

const getGroupName = (key: string) => {
  let groupName = '';
  const label = GROUPS[key as keyof typeof GROUPS];
  if (label) {
    groupName = label;
  } else {
    groupName = key;
  }
  return groupName;
};

const getGroups = (settings: DeviceSetting[]) => {
  let groups: string[] = [];
  settings.forEach((setting) => {
    if (
      setting.group &&
      (groups.length === 0 || !groups.find((group) => group === setting.group))
    ) {
      groups.push(setting.group);
    }
  });
  return groups;
};
