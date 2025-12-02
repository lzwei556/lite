import React from 'react';
import { CustomizableInterval } from '../characteristic/customizable-interval';
import { MonitoringPointRow } from 'monitoring-point';
import { useCustomizableInterval } from '../use-services';
import { CharacteristicData, MonitoringPointType } from 'common';

export const CustomizableIntervalMonitoringPointData = ({
  id,
  name,
  type,
  properties,
  attributes
}: MonitoringPointRow) => {
  return (
    <CustomizableInterval
      {...{
        ...useCustomizableInterval(id, 'monitoringPoints'),
        id,
        name,
        properties: MonitoringPointType.Key.getProperties(type, properties).map((p) =>
          CharacteristicData.appendAxisAliasAbbrToField(p, attributes)
        ),
        urlPathname: 'monitoringPoints'
      }}
    />
  );
};
