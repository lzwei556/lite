import React from 'react';
import { SelectProps } from 'antd';
import intl from 'react-intl-universal';
import { LightSelectFilter } from '../../components';

export const PropertyLightSelectFilter = (
  props: { properties: { name: string; key: string }[] } & Pick<SelectProps, 'onChange' | 'value'>
) => {
  const { properties, ...rest } = props;
  return (
    <LightSelectFilter
      {...rest}
      allowClear={false}
      options={properties.map(({ name, key }) => ({
        label: intl.get(name).d(name),
        value: key
      }))}
      prefix={intl.get('PROPERTY')}
    />
  );
};
