import React from 'react';
import { MonitoringPointRow, Point } from '../asset-common';
import * as Corrosion from '../features/monitoring-point-corrosion';

export const MonitoringPoint = (props: {
  monitoringPoint: MonitoringPointRow;
  onSuccess: () => void;
}) => {
  const { type } = props.monitoringPoint;
  if (Point.Assert.isCorrosionRelated(type)) {
    return <Corrosion.Index {...props} />;
  }
};
