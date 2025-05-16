import React from 'react';
import { AXIS, AXIS_ALIAS, AxisKey, MonitoringPointRow, Point } from '../../asset-common';

export type Axis = { label: string; value: number; selected?: boolean; key: AxisKey };

export const getAxisOptions = (attrs?: MonitoringPointRow['attributes']) => {
  return Object.values(AXIS_ALIAS).map(({ key, label }, i) => {
    let defaultAxisKey: AxisKey = AXIS.Z.key;
    switch (key) {
      case AXIS_ALIAS.Axial.key:
        defaultAxisKey = AXIS.Z.key;
        break;
      case AXIS_ALIAS.Vertical.key:
        defaultAxisKey = AXIS.Y.key;
        break;
      case AXIS_ALIAS.Horizontal.key:
        defaultAxisKey = AXIS.X.key;
        break;
    }
    const axisKey = attrs?.[key] ?? defaultAxisKey;
    const axis = Point.getAxis(axisKey)!;
    return { label, key: axis.key, value: axis.value, selected: i === 0 } as Axis;
  });
};

export function useAxis(attrs?: MonitoringPointRow['attributes']) {
  const [axies, setAxies] = React.useState<Axis[]>(getAxisOptions(attrs));
  return { axis: axies.find((a) => !!a.selected) ?? axies[0], axies, setAxies };
}
