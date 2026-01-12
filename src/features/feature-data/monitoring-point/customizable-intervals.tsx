import { Space } from 'antd';
import { Card, MutedCard, useRange } from 'components';
import React from 'react';
import { HistoryDataFea } from 'features';
import { PropertyLightSelectFilter } from 'asset-common';
import { CustmizableIntervalLayout } from '../custmizable-interval-layout';
import { FeatureData, MonitoringPoint, MonitoringPointType } from 'common';
import { useCustomizableIntervals } from '../use-services';
import intl from 'react-intl-universal';

export const CustomizableIntervals = ({
  monitoringPoints,
  interactionDisabled = false
}: {
  monitoringPoints: MonitoringPoint[];
  interactionDisabled?: boolean;
}) => {
  const { property, cardProps, chartProps, ...rest } = useProps(monitoringPoints);

  return (
    <CustmizableIntervalLayout
      {...rest}
      content={
        property &&
        (interactionDisabled ? (
          <MutedCard title={cardProps.title}>
            <HistoryDataFea.PropertyChartList {...chartProps} key={property.key} />
          </MutedCard>
        ) : (
          <Card
            extra={
              <Space>
                <PropertyLightSelectFilter {...cardProps.extra.propertySelectProps} />
              </Space>
            }
            title={cardProps.title}
          >
            <HistoryDataFea.PropertyChartList {...chartProps} key={property.key} />
          </Card>
        ))
      }
      interactionDisabled={interactionDisabled}
    />
  );
};

const useProps = (monitoringPoints: MonitoringPoint[]) => {
  const { properties: _properties, type } = monitoringPoints[0];
  const properties = MonitoringPointType.Key.getProperties(type, _properties);
  const { numberedRange, setRange } = useRange();
  const { datas, initialRange, loading } = useCustomizableIntervals(
    monitoringPoints,
    numberedRange
  );
  const { property, setProperty } = useSelectedProperty(properties?.[0]);

  return {
    dateRangePickerProps: {
      defaultValue: initialRange,
      onChange: setRange
    },
    loading,
    property,
    cardProps: {
      title: intl.get(property?.name!),
      extra: {
        propertySelectProps: {
          onChange: (value: string) => {
            setProperty(properties.find((item: any) => item.key === value));
          },
          properties,
          value: property?.key
        }
      }
    },
    chartProps: { data: datas, property: property!, style: { height: 600 } }
  };
};

const useSelectedProperty = (initial?: FeatureData.DisplayProperty) => {
  const [property, setProperty] = React.useState<FeatureData.DisplayProperty | undefined>(initial);
  return { property, setProperty };
};
