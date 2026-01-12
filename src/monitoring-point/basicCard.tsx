import React from 'react';
import intl from 'react-intl-universal';
import { Descriptions, DescriptionsProps, MutedCard } from '../components';
import { getOptionLabelByValue, getPluralUnitInEnglish, getValue, truncate } from '../utils';
import { useLocaleContext } from '../localeProvider';
import { MonitoringPoint, MonitoringPointType } from 'common';
import { MonitoringPointAttributes } from 'common/monitoring-point-attributes';
import { useAssets } from 'features/monitoring-point-settings/use-basic-form-items';
import { MonitoringPointRow } from 'asset-common';

export const BasicCard = ({ monitoringPoint }: { monitoringPoint: MonitoringPointRow }) => {
  const { language } = useLocaleContext();
  const { assetId, attributes, type } = monitoringPoint;
  const parent = useAssets({ type }).find((asset) => asset.id === assetId);
  const items: DescriptionsProps['items'] = [
    {
      label: intl.get('TYPE'),
      children: intl.get(MonitoringPointType.Key.getLabel(type))
    }
  ];
  if (parent) {
    items.push({ label: intl.get('asset.parent'), children: truncate(parent.name, 24) });
  }
  if (attributes) {
    const fields = MonitoringPointType.Key.getAttributes(type);
    fields.forEach(({ label, name, translatingUnit, type, options, unit }) => {
      const children = attributes[name as keyof MonitoringPointAttributes];
      if (type === 'string') {
        items.push({
          label: intl.get(label),
          children
        });
      } else if (type === 'enum' && options && options.length > 0) {
        items.push({
          label: intl.get(label),
          children: intl.get(getOptionLabelByValue(options, children))
        });
      } else {
        items.push({
          label: intl.get(label),
          children: getValue({
            value: children as number,
            unit: translatingUnit ? intl.get(translatingUnit) : unit
          })
        });
      }
    });
  }
  return (
    <MutedCard title={intl.get('ASSET')}>
      <Descriptions items={items} />
    </MutedCard>
  );
};
