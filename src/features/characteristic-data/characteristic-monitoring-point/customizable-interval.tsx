import React from 'react';
import { CustomizableInterval } from '../characteristic/customizable-interval';
import { useCustomizableInterval } from '../use-services';
import { CharacteristicData, MonitoringPoint, MonitoringPointType } from 'common';

export const CustomizableIntervalMonitoringPointData = ({
  id,
  name,
  type,
  properties,
  attributes
}: MonitoringPoint & { getAlarm: (property: CharacteristicData.DisplayProperty) => void }) => {
  return (
    <CustomizableInterval
      {...{
        ...useCustomizableInterval(id, 'monitoringPoints'),
        id,
        name,
        properties: MonitoringPointType.Key.getProperties(type, properties).map((property) => ({
          ...property,
          fields: CharacteristicData.appendVibrationDirectionAbbrToField(
            property.fields,
            attributes
          )
        })),
        urlPathname: 'monitoringPoints'
      }}
    />
  );
};
