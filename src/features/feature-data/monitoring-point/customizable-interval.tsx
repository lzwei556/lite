import React from 'react';
import { CustomizableInterval } from '../common/customizable-interval';
import { useCustomizableInterval } from '../use-services';
import * as MonitoringPoint from 'domains/monitoring-point';
import * as Feature from 'domains/feature-property';

export const CustomizableIntervalMonitoringPointData = ({
  id,
  name,
  type,
  properties,
  attributes
}: MonitoringPoint.Types.Entity & { getAlarm: (property: Feature.Types.Property) => void }) => {
  return (
    <CustomizableInterval
      {...{
        ...useCustomizableInterval(id, 'monitoringPoints'),
        id,
        name,
        properties: MonitoringPoint.Type.getProperties({ type, properties }).map((property) => ({
          ...property,
          fields: Feature.Property.appendVibrationDirectionAbbr(property.fields, attributes)
        })),
        urlPathname: 'monitoringPoints'
      }}
    />
  );
};
