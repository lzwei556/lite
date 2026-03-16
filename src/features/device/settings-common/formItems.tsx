import React from 'react';
import { Translation } from 'locales/utils';
import { Card, Grid } from '../../../components';
import { DeviceType } from '../../../types/device_type';
import { FormItemsProps, SettingFormItem } from '.';
import { useGroupedSettings } from './common';

export const SettingsFormItems = ({
  settings,
  deviceType,
  formItemColProps,
  groupCardProps,
  ignoreGroup
}: FormItemsProps & {
  deviceType?: DeviceType;
  ignoreGroup?: boolean;
}) => {
  const groups = useGroupedSettings(settings, deviceType);

  const getTitle = (name: string) => {
    const isTitleUndefined = groups.length === 1 && ignoreGroup;
    if (!isTitleUndefined) {
      if (name.indexOf('channel') > -1) {
        return Translation.get('SETTING_GROUP_CHANNEL', {
          channel: name.replace('channel', '')
        });
      } else {
        return Translation.get(name);
      }
    }
  };

  return groups.map(({ group, settings }) => (
    <Card key={group} {...{ ...groupCardProps, title: groupCardProps?.title ?? getTitle(group) }}>
      <Grid>
        {settings.map((s) => (
          <SettingFormItem
            key={`${s.key}${s.options ? Object.keys(s.options).join('') : ''}`}
            value={s}
            formItemColProps={formItemColProps}
            ignoreChildren={DeviceType.isVibration(deviceType)}
          />
        ))}
      </Grid>
    </Card>
  ));
};
