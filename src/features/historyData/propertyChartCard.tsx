import React from 'react';
import { Select, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card, CardProps, Term } from '../../components';
import { DisplayProperty } from '../../constants/properties';
import { useLocaleContext } from '../../localeProvider';
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
  let title = `${intl.get(name).d(name)}`;
  let valueEle = null;
  const values = transform(data, property).values;

  if (values.length > 1) {
    title = getDisplayName({ name: title, suffix: unit, lang: language });
    valueEle = (
      <Select
        defaultValue={`${values[0].name} ${values[0].last}`}
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
        style={{ minWidth: 85 }}
        variant='filled'
      />
    );
  } else if (values.length === 1) {
    valueEle = getValue(roundValue(values[0].last, precision), unit);
  }

  return (
    <Space align='center' style={{ fontWeight: 400 }} size={16}>
      <Typography.Text>
        <Term name={title} description={intl.get(`${name}_DESC`)} />
      </Typography.Text>
      {valueEle}
    </Space>
  );
};
