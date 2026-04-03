import React from 'react';
import { CustomizableInterval } from '../common/customizable-interval';
import { useCustomizableInterval } from '../use-services';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';
import { Feature, FeatureProperty } from 'domain/feature-property';

export const CustomizableIntervalMonitoringPointData = ({
  id,
  name,
  type,
  properties,
  attributes
}: TMonitoringPoint.Base & { getAlarm: (property: Feature.Property) => void }) => {
  return (
    <CustomizableInterval
      {...{
        ...useCustomizableInterval(id, 'monitoringPoints'),
        id,
        name,
        properties: OMonitoringPoint.Type.getProperties({ type, properties }).map((property) => ({
          ...property,
          fields: FeatureProperty.appendVibrationDirectionAbbr(property.fields, attributes)
        })),
        urlPathname: 'monitoringPoints'
      }}
    />
  );
};
