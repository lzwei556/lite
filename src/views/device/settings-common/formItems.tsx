import React from 'react';
import intl from 'react-intl-universal';
import { Card, Grid } from '../../../components';
import { DeviceType } from '../../../types/device_type';
import { FormItemsProps, SettingFormItem } from '../settings-common';
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
        return intl.get('SETTING_GROUP_CHANNEL', {
          channel: name.replace('channel', '')
        });
      } else {
        return intl.get(name);
      }
    }
  };

  return groups.map(({ group, settings }) => (
    <Card key={group} {...{ ...groupCardProps, title: groupCardProps?.title ?? getTitle(group) }}>
      <Grid>
        {settings.map((s) => (
          <SettingFormItem
            key={s.key}
            value={s}
            formItemColProps={formItemColProps}
            ignoreChildren={DeviceType.isVibration(deviceType)}
          />
        ))}
      </Grid>
    </Card>
  ));
};
