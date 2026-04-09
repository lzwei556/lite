import { LightSelectFilter } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { Property, useProperty } from './useTrend';
import * as MonitoringPoint from 'domain/monitoring-point';
import * as Axis from 'domain/axis';

export type PropertyFilters = {
  property: Property;
  options: Property[];
  setProperty: React.Dispatch<React.SetStateAction<Property>>;
};

export const PropertiesSelect = ({ property, setProperty, options }: PropertyFilters) => {
  return (
    <LightSelectFilter
      allowClear={false}
      options={options.map((p) => ({ ...p, label: intl.get(p.label) }))}
      onChange={(value: Property['value']) => {
        const property = options.find((opt) => opt.value === value);
        if (property) {
          setProperty(property);
        }
      }}
      value={property.value}
    />
  );
};

export const usePropertiesFilters = (isAnalysisOnlyAcceleration?: boolean): PropertyFilters => {
  const { property, setProperty, options } = useProperty(
    isAnalysisOnlyAcceleration ? 'acceleration' : undefined
  );
  return { property, setProperty, options };
};

export type AxisFilters = {
  axis: MonitoringPoint.Settings.AxisWithVibrationDirection;
  setAxis: React.Dispatch<
    React.SetStateAction<MonitoringPoint.Settings.AxisWithVibrationDirection>
  >;
  options: MonitoringPoint.Settings.AxisWithVibrationDirection[];
};

export const AxisSelect = ({ axis, options, setAxis }: AxisFilters) => {
  return (
    <LightSelectFilter
      allowClear={false}
      options={options.map((a) => ({ ...a, label: intl.get(a.label) }))}
      onChange={(value: Axis.Option['value']) => {
        const axis = options.find((opt) => opt.value === value);
        if (axis) {
          setAxis(axis);
        }
      }}
      popupMatchSelectWidth={false}
      value={axis.value}
    />
  );
};

export const useAxisFilters = (attributes?: MonitoringPoint.Settings.Entity): AxisFilters => {
  const { axis, setAxis, options } = MonitoringPoint.Hooks.useAxisWithVibrationDirection(
    attributes as MonitoringPoint.Settings.VibrationDirection
  );
  return { axis, setAxis, options };
};
