import React from 'react';
import { Select, Space } from 'antd';
import intl from 'react-intl-universal';
import { Card, CardProps, Term } from '../../components';
import { useLocaleContext } from '../../localeProvider';
import { DisplayProperty } from '../../constants/properties';
import { getDisplayName, getValue, roundValue } from '../../utils/format';
import { HistoryData } from '../../views/asset-common';
import { PropertyChart, transform } from './propertyChart';

export const PropertyChartCard = (props: {
  data?: HistoryData;
  property: DisplayProperty;
  cardprops?: CardProps;
}) => {
  return (
    <Card {...props.cardprops} title={<PropertyChartTitle {...props} />}>
      <PropertyChart
        {...props}
        config={{
          opts: { grid: { bottom: 16 } },
          switchs: { noDataZoom: true }
        }}
        style={{ height: 240 }}
      />
    </Card>
  );
};

const PropertyChartTitle = ({
  data,
  property
}: {
  data?: HistoryData;
  property: DisplayProperty;
}) => {
  const { language } = useLocaleContext();
  const { name, unit, precision } = property;
  let title = intl.get(name).d(name);
  let valueEle = null;
  const values = transform(data, property).values;
  const isSingle = values.length === 1;

  if (values.length > 1) {
    title = getDisplayName({ name: title, suffix: unit, lang: language });
    const defaultValue = `${values[0].name} ${values[0].last}`;
    valueEle = (
      <Select
        key={defaultValue}
        defaultValue={defaultValue}
        options={values.map((v) => ({
          label: (
            <Space>
              {v.name}
              {getValue(roundValue(v.last, precision))}
            </Space>
          ),
          value: `${v.name} ${v.last}`
        }))}
        size='small'
        style={{ minWidth: 130 }}
        variant='filled'
      />
    );
  } else if (isSingle) {
    valueEle = getValue(roundValue(values[0].last, precision), unit);
  }

  return (
    <Space align='center' style={{ fontWeight: 400 }} size={isSingle ? 16 : 8} wrap={true}>
      <Term name={title} description={intl.get(`${name}_DESC`)} size={isSingle ? 8 : 2} />
      {valueEle}
    </Space>
  );
};
