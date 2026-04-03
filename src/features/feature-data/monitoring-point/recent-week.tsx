import React from 'react';
import { RecentWeek } from '../common/recent-week';
import { useRecentWeek } from '../use-services';
import { InclinationGridItem } from './inclination/inclination-offset';
import { getColProps } from '../common/use-recent-week-props';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';
import { Feature, FeatureProperty } from 'domain/feature-property';

export const RecentWeekMonitoringPointData = ({
  id,
  name,
  type,
  attributes,
  ...rest
}: TMonitoringPoint.Base & { getAlarm: (property: Feature.Property) => void }) => {
  const { data, loading } = useRecentWeek(id, 'monitoringPoints');
  const properties = OMonitoringPoint.Type.getProperties({ type, properties: rest.properties }).map(
    (property) => ({
      ...property,
      fields: FeatureProperty.appendVibrationDirectionAbbr(property.fields, attributes)
    })
  );
  const colProps = getColProps(properties.length);

  return (
    <RecentWeek
      {...{
        ...rest,
        colProps,
        data,
        inclinationGridItem: <InclinationGridItem {...{ colProps, data, name, type }} />,
        loading,
        properties
      }}
    />
  );
};
