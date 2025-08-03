import React from 'react';
import { MonitoringPointRow, Point } from '../asset-common';
import * as Corrosion from '../features/monitoring-point-corrosion';
import * as Vibration from '../features/monitoring-point-vibration';
import * as WindTurbine from '../features/monitoring-point-wind-turbine';
import * as Device from '../features/monitoring-point-device';

export const MonitoringPoint = (props: {
  monitoringPoint: MonitoringPointRow;
  onSuccess: () => void;
}) => {
  const { type } = props.monitoringPoint;
  if (Point.Assert.isCorrosionRelated(type)) {
    return <Corrosion.Index {...props} />;
  } else if (Point.Assert.isVibrationRelated(type)) {
    return <Vibration.Index {...props} />;
  } else if (Point.Assert.isWindRelated(type)) {
    return <WindTurbine.Index {...props} />;
  } else if (Point.Assert.isTemperatureRelated(type) || Point.Assert.isPressureRelated(type)) {
    return <Device.Index {...props} />;
  }
};
