import React from 'react';
import { Space, Typography } from 'antd';
import { Translation } from 'locales/utils';
import { Card, CardProps, SeriesAlarm, Term } from '../../components';
import { getValue } from '../../utils/format';
import { HistoryData } from '../../asset-common';
import { useGlobalStyles } from '../../styles';
import { PropertyChart, transform } from './propertyChart';
import { CharacteristicData } from 'common';
import { useI18n } from 'providers/i18n';
import { getDisplayName } from 'locales/utils';

export const PropertyChartCard = (props: {
  data?: HistoryData;
  property: CharacteristicData.DisplayProperty;
  cardProps?: CardProps;
  alarm?: Pick<SeriesAlarm, 'rules'> & { propertyKey: string };
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
  property: CharacteristicData.DisplayProperty;
}) => {
  const { language } = useI18n();
  const { name, unit, precision } = property;
  const values = transform(data, property).values;
  const { colorTextDescriptionStyle } = useGlobalStyles();

  if (values.length <= 2) {
    return values.map(({ name, last }) => {
      let title = Translation.get(name);
      return (
        <Space key={name} style={{ display: 'flex', lineHeight: 1.35 }}>
          <Term
            name={title}
            nameProps={{ style: colorTextDescriptionStyle }}
            description={Translation.get(`${name}_DESC`)}
          />
          {getValue({ value: last, unit, precision })}
        </Space>
      );
    });
  } else {
    return (
      <>
        <Space style={{ display: 'flex' }}>
          <Term
            name={getDisplayName({
              name: Translation.get(name),
              suffix: unit,
              lang: language
            })}
            nameProps={{ style: colorTextDescriptionStyle }}
            description={Translation.get(`${name}_DESC`)}
          />
        </Space>
        <Space size={5} style={{ display: 'flex', fontSize: 13 }}>
          {values.map(({ name, last }) => (
            <React.Fragment key={name}>
              <Typography.Text style={{ fontSize: 13 }} type='secondary'>
                {Translation.get(name)}
              </Typography.Text>
              {getValue({ value: last, precision })}
            </React.Fragment>
          ))}
        </Space>
      </>
    );
  }
};
