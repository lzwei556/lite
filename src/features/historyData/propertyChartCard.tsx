import React from 'react';
import { Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card, CardProps, Term } from '../../components';
import { useLocaleContext } from '../../localeProvider';
import { DisplayProperty } from '../../constants/properties';
import { getDisplayName, getValue, roundValue } from '../../utils/format';
import { HistoryData } from '../../asset-common';
import { PropertyChart, transform } from './propertyChart';

export const PropertyChartCard = (props: {
  data?: HistoryData;
  property: DisplayProperty;
  cardProps?: CardProps;
}) => {
  return (
    <Card {...props.cardProps} title={<PropertyChartTitle {...props} />}>
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
  const values = transform(data, property).values;

  if (values.length <= 2) {
    return values.map(({ name, last }) => {
      let title = intl.get(name).d(name);
      return (
        <Space key={name} style={{ display: 'flex', lineHeight: 1.35 }}>
          <Term
            name={title}
            nameProps={{ style: { color: 'rgba(0,0,0,.45)' } }}
            description={intl.get(`${name}_DESC`)}
          />
          {getValue(roundValue(last, precision), unit)}
        </Space>
      );
    });
  } else {
    return (
      <>
        <Space style={{ display: 'flex' }}>
          <Term
            name={getDisplayName({ name: intl.get(name).d(name), suffix: unit, lang: language })}
            nameProps={{ style: { color: 'rgba(0,0,0,.45)' } }}
            description={intl.get(`${name}_DESC`)}
          />
        </Space>
        <Space size={5} style={{ display: 'flex', fontSize: 13 }}>
          {values.map(({ name, last }) => (
            <React.Fragment key={name}>
              <Typography.Text style={{ fontSize: 13 }} type='secondary'>
                {intl.get(name).d(name)}
              </Typography.Text>
              {getValue(roundValue(last, precision))}
            </React.Fragment>
          ))}
        </Space>
      </>
    );
  }
};
