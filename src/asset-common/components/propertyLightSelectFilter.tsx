import React from 'react';
import { SelectProps } from 'antd';
import { LightSelectFilter } from '../../components';
import { Translation } from 'locales/utils';

export const PropertyLightSelectFilter = (
  props: { properties: { name: string; key: string }[] } & Pick<SelectProps, 'onChange' | 'value'>
) => {
  const { properties, ...rest } = props;
  return (
    <LightSelectFilter
      {...rest}
      allowClear={false}
      options={properties.map(({ name, key }) => ({
        label: Translation.get(name),
        value: key
      }))}
      prefix={Translation.get('feature.property')}
    />
  );
};
