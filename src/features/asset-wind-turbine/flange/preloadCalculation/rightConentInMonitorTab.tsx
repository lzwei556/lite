import React from 'react';
import { MonitoringPointTypeValue } from '../../../../config';
import { roundValue } from '../../../../utils/format';
import { DisplayProperty } from '../../../../constants/properties';
import { AssetRow, Point, Points } from '../../../../asset-common';
import { FakeVSRealChart } from './fakeVSRealChart';

export const RightConentInMonitorTab = ({ asset }: { asset: AssetRow }) => {
  const points = asset.monitoringPoints ?? [];
  const actuals = Points.filter(points).filter((point) => !!point.data);
  const fakes = points
    .filter((point) => point.type === MonitoringPointTypeValue.FlangeBoltPreload)
    .filter((point) => !!point.data);
  let properties: DisplayProperty[] = [];
  if (actuals.length > 0) {
    properties = Point.getPropertiesByType(actuals[0].type, actuals[0].properties);
  }
  const property = properties.length > 0 ? properties[0] : undefined;
  let bolts: number[] = [];
  if (fakes.length > 0 && property) {
    bolts = ((fakes[0].data?.values[property.key] || []) as number[]).map((val) => roundValue(val));
  }
  return (
    <FakeVSRealChart
      bolts={bolts}
      points={{
        data: property
          ? actuals.map(({ data }) => roundValue((data?.values[property.key] as number) || NaN))
          : [],
        indexs: actuals.map(({ attributes }) => (attributes ? attributes.index : 1))
      }}
      property={property}
    />
  );
};
