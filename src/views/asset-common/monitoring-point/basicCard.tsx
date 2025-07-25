import React from 'react';
import intl from 'react-intl-universal';
import { Descriptions, DescriptionsProps, MetaCard } from '../../../components';
import { useMonitoringPointParents } from '../../asset-variant';
import { useParents } from '../../app-wind-turbine/point/common';
import { Point } from './util';
import { MonitoringPointRow } from './types';
import { AXIS_ALIAS } from './constants';

export const BasicCard = ({ monitoringPoint }: { monitoringPoint: MonitoringPointRow }) => {
  const { assetId, attributes, type } = monitoringPoint;
  const parents1 = useMonitoringPointParents(() => true);
  const parents2 = useParents();
  const asset = parents1.concat(parents2).find((p) => p.id === assetId);
  const items: DescriptionsProps['items'] = [
    {
      label: intl.get('TYPE'),
      children: intl.get(Point.getTypeLabel(type)!)
    }
  ];
  if (asset) {
    items.push({ label: intl.get('asset.parent'), children: asset.name });
  }
  if (attributes) {
    const {
      index,
      axial,
      vertical,
      horizontal,
      critical_thickness,
      critical_thickness_enabled,
      initial_thickness,
      initial_thickness_enabled,
      corrosion_rate_short_term,
      corrosion_rate_long_term,
      tower_install_angle,
      tower_install_height,
      tower_base_radius
    } = attributes;
    items.push({ label: intl.get('POSITION'), children: index });
    if (axial) {
      const axis = Point.getAxis(axial);
      items.push({
        label: intl.get(AXIS_ALIAS.Axial.label),
        children: axis ? intl.get(axis.label) : '-'
      });
    }
    if (vertical) {
      const axis = Point.getAxis(vertical);
      items.push({
        label: intl.get(AXIS_ALIAS.Vertical.label),
        children: axis ? intl.get(axis.label) : '-'
      });
    }
    if (horizontal) {
      const axis = Point.getAxis(horizontal);
      items.push({
        label: intl.get(AXIS_ALIAS.Horizontal.label),
        children: axis ? intl.get(axis.label) : '-'
      });
    }
    if (initial_thickness_enabled && initial_thickness) {
      items.push({
        label: intl.get('INITIAL_THICKNESS'),
        children: `${initial_thickness}mm`
      });
    }
    if (critical_thickness_enabled && critical_thickness) {
      items.push({
        label: intl.get('CRITICAL_THICKNESS'),
        children: `${critical_thickness}mm`
      });
    }
    if (corrosion_rate_short_term) {
      items.push({
        label: intl.get('CORROSION_RATE_SHORT_TERM'),
        children: `${corrosion_rate_short_term}${intl.get('UNIT_DAY')}`
      });
    }
    if (corrosion_rate_long_term) {
      items.push({
        label: intl.get('CORROSION_RATE_LONG_TERM'),
        children: `${corrosion_rate_long_term}${intl.get('UNIT_DAY')}`
      });
    }
    if (tower_install_height) {
      items.push({
        label: intl.get('TOWER_INSTALL_HEIGHT'),
        children: `${tower_install_height}m`
      });
    }
    if (tower_install_angle) {
      items.push({
        label: intl.get('TOWER_INSTALL_ANGLE'),
        children: `${tower_install_angle}°`
      });
    }
    if (tower_base_radius) {
      items.push({
        label: intl.get('TOWER_BASE_RADIUS'),
        children: `${tower_base_radius}m`
      });
    }
  }
  return <MetaCard description={<Descriptions items={items} />} title={intl.get('ASSET')} />;
};
