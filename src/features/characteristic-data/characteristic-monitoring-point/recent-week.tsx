import React from 'react';
import { RecentWeek } from '../characteristic/recent-week';
import { useRecentWeek } from '../use-services';
import { getSeriesAlarm, MonitoringPointRow, useMonitoringPointContext } from 'monitoring-point';
import { InclinationGridItem } from './inclination/inclination-offset';
import { getColProps } from '../characteristic/use-recent-week-props';
import { CharacteristicData, MonitoringPointType } from 'common';

export const RecentWeekMonitoringPointData = ({
  id,
  name,
  type,
  properties: propertiesFormProps,
  attributes
}: MonitoringPointRow) => {
  const { data, loading } = useRecentWeek(id, 'monitoringPoints');
  const { ruleGroups } = useMonitoringPointContext();
  const properties = MonitoringPointType.Key.getProperties(type, propertiesFormProps).map((p) =>
    CharacteristicData.appendAxisAliasAbbrToField(p, attributes)
  );
  const colProps = getColProps(properties.length);

  return (
    <RecentWeek
      {...{
        colProps,
        data,
        getAlarm: (property) => getSeriesAlarm(ruleGroups, property),
        inclinationGridItem: <InclinationGridItem {...{ colProps, data, name, type }} />,
        loading,
        properties
      }}
    />
  );
};
