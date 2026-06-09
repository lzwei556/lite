import React from 'react';
import { RecentWeek } from '../common/recent-week';
import { useRecentWeek } from '../use-services';
import { InclinationGridItem } from './inclination/inclination-offset';
import { getColProps } from '../common/use-recent-week-props';
import * as MonitoringPoint from 'domains/monitoring-point';
import * as Feature from 'domains/feature-property';

export const RecentWeekMonitoringPointData = ({
  id,
  name,
  type,
  attributes,
  ...rest
}: MonitoringPoint.Types.Entity & { getAlarm: (property: Feature.Types.Property) => void }) => {
  const { data, loading } = useRecentWeek(id, 'monitoringPoints');
  const properties = MonitoringPoint.Type.getProperties({ type, properties: rest.properties }).map(
    (property) => ({
      ...property,
      fields: Feature.Property.appendVibrationDirectionAbbr(property.fields, attributes)
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
