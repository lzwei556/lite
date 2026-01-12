import React from 'react';
import { RecentWeek } from '../common/recent-week';
import { useRecentWeek } from '../use-services';
import { InclinationGridItem } from './inclination/inclination-offset';
import { getColProps } from '../common/use-recent-week-props';
import { FeatureData, MonitoringPoint, MonitoringPointType } from 'common';

export const RecentWeekMonitoringPointData = ({
  id,
  name,
  type,
  attributes,
  ...rest
}: MonitoringPoint & { getAlarm: (property: FeatureData.DisplayProperty) => void }) => {
  const { data, loading } = useRecentWeek(id, 'monitoringPoints');
  const properties = MonitoringPointType.Key.getProperties(type, rest.properties).map(
    (property) => ({
      ...property,
      fields: FeatureData.appendVibrationDirectionAbbrToField(property.fields, attributes)
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
