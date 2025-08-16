import React from 'react';
import intl from 'react-intl-universal';
import { Descriptions, DescriptionsProps, MutedCard } from '../components';
import { useMonitoringPointParents } from '../asset-variant';
import { Asset } from '../asset-common';
import { Point } from './util';
import { MonitoringPointRow } from './types';
import {
  AXIS_ALIAS,
  CorrosionRateLongTerm,
  CorrosionRateShortTerm,
  CriticalThickness,
  InitialThickness,
  TowerBaseRadius,
  TowerInstallAngle,
  TowerInstallHeight
} from './constants';
import { getPluralUnitInEnglish, getValue, truncate } from '../utils';
import { useLocaleContext } from '../localeProvider';
import { useParents } from '../features/monitoring-point-wind-turbine/common';

export const BasicCard = ({ monitoringPoint }: { monitoringPoint: MonitoringPointRow }) => {
  const { language } = useLocaleContext();
  const { assetId, attributes, type } = monitoringPoint;
  const parents1 = useMonitoringPointParents(
    (asset) =>
      Asset.Assert.isCorrosionRelated(asset.type) ||
      Asset.Assert.isVibrationRelated(asset.type) ||
      Asset.Assert.isDeviceRelated(asset.type)
  );
  const parents2 = useParents();

  const asset = [...parents1, ...parents2].find((p) => p.id === assetId);
  const items: DescriptionsProps['items'] = [
    {
      label: intl.get('TYPE'),
      children: intl.get(Point.getTypeLabel(type)!)
    }
  ];
  if (asset) {
    items.push({ label: intl.get('asset.parent'), children: truncate(asset.name, 24) });
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
        label: intl.get(AXIS_ALIAS.Axial.abbr),
        children: axis ? intl.get(axis.label) : '-'
      });
    }
    if (vertical) {
      const axis = Point.getAxis(vertical);
      items.push({
        label: intl.get(AXIS_ALIAS.Vertical.abbr),
        children: axis ? intl.get(axis.label) : '-'
      });
    }
    if (horizontal) {
      const axis = Point.getAxis(horizontal);
      items.push({
        label: intl.get(AXIS_ALIAS.Horizontal.abbr),
        children: axis ? intl.get(axis.label) : '-'
      });
    }
    if (initial_thickness_enabled && initial_thickness) {
      items.push({
        label: intl.get(InitialThickness.label),
        children: getValue({ value: initial_thickness, unit: InitialThickness.unit })
      });
    }
    if (critical_thickness_enabled && critical_thickness) {
      items.push({
        label: intl.get(CriticalThickness.label),
        children: getValue({ value: critical_thickness, unit: CriticalThickness.unit })
      });
    }
    if (corrosion_rate_short_term) {
      items.push({
        label: intl.get(CorrosionRateShortTerm.label),
        children: getValue({
          value: corrosion_rate_short_term,
          unit: getPluralUnitInEnglish(corrosion_rate_short_term, intl.get('UNIT_DAY'), language)
        })
      });
    }
    if (corrosion_rate_long_term) {
      items.push({
        label: intl.get(CorrosionRateLongTerm.label),
        children: getValue({
          value: corrosion_rate_long_term,
          unit: getPluralUnitInEnglish(corrosion_rate_long_term, intl.get('UNIT_DAY'), language)
        })
      });
    }
    if (tower_install_height) {
      items.push({
        label: intl.get(TowerInstallHeight.label),
        children: getValue({ value: tower_install_height, unit: TowerInstallHeight.unit })
      });
    }
    if (tower_install_angle) {
      items.push({
        label: intl.get(TowerInstallAngle.label),
        children: getValue({ value: tower_install_angle, unit: TowerInstallAngle.unit })
      });
    }
    if (tower_base_radius) {
      items.push({
        label: intl.get(TowerBaseRadius.label),
        children: getValue({ value: tower_base_radius, unit: TowerBaseRadius.unit })
      });
    }
  }
  return (
    <MutedCard title={intl.get('ASSET')}>
      <Descriptions items={items} />
    </MutedCard>
  );
};
