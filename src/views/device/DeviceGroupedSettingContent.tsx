import * as React from 'react';
import intl from 'react-intl-universal';
import DeviceSettingFormItem from '../../components/formItems/deviceSettingFormItem';
import { SETTING_GROUPS } from '../../constants/settingGroup';
import { DeviceSetting } from '../../types/device_setting';

export const DeviceGroupedSettingContent: React.FC<{
  settings?: DeviceSetting[];
  filterSingleGroup?: boolean;
}> = ({ settings, filterSingleGroup = false }) => {
  if (settings) {
    let groups: string[] = [];
    settings.forEach((setting) => {
      if (
        setting.group &&
        (groups.length === 0 || !groups.find((group) => group === setting.group))
      ) {
        groups.push(setting.group);
      }
    });
    if (groups.length > 0) {
      return (
        <>
          {groups.map((group) => {
            let groupName = '';
            const label = SETTING_GROUPS[group as keyof typeof SETTING_GROUPS];
            if (label) {
              groupName = intl.get(label);
            } else if (group.indexOf('channel') > -1) {
              groupName = intl.get('SETTING_GROUP_CHANNEL', {
                channel: group.replace('channel', '')
              });
            }
            return filterSingleGroup && groups.length === 1 ? (
              settings
                .filter((setting) => setting.group === group)
                .sort((prev, next) => prev.sort - next.sort)
                .map((setting) => (
                  <DeviceSettingFormItem editable={true} value={setting} key={setting.key} />
                ))
            ) : (
              <fieldset key={group}>
                <legend>{groupName}</legend>
                {settings
                  .filter((setting) => setting.group === group)
                  .sort((prev, next) => prev.sort - next.sort)
                  .map((setting) => (
                    <DeviceSettingFormItem editable={true} value={setting} key={setting.key} />
                  ))}
              </fieldset>
            );
          })}
        </>
      );
    }
  }
  return null;
};
