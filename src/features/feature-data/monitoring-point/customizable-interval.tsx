import React from 'react';
import { CustomizableInterval } from '../common/customizable-interval';
import { useCustomizableInterval } from '../use-services';
import { FeatureData, MonitoringPoint, MonitoringPointType } from 'common';

export const CustomizableIntervalMonitoringPointData = ({
  id,
  name,
  type,
  properties,
  attributes
}: MonitoringPoint & { getAlarm: (property: FeatureData.DisplayProperty) => void }) => {
  return (
    <CustomizableInterval
      {...{
        ...useCustomizableInterval(id, 'monitoringPoints'),
        id,
        name,
        properties: MonitoringPointType.Key.getProperties(type, properties).map((property) => ({
          ...property,
          fields: FeatureData.appendVibrationDirectionAbbrToField(property.fields, attributes)
        })),
        urlPathname: 'monitoringPoints'
      }}
    />
  );
};
