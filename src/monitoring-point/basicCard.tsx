import React from 'react';
import { Translation } from 'locales/utils';
import { Descriptions, DescriptionsProps, MutedCard } from '../components';
import { formatUnitTranslationKeyWithPlural, getOptionLabelByValue, getValue } from '../utils';
import { MonitoringPointType } from 'common';
import { MonitoringPointAttributes } from 'common/monitoring-point-attributes';
import { useAssets } from 'features/monitoring-point-settings/use-basic-form-items';
import { MonitoringPointRow } from 'asset-common';

export const BasicCard = ({ monitoringPoint }: { monitoringPoint: MonitoringPointRow }) => {
  const { assetId, attributes, type } = monitoringPoint;
  const parent = useAssets({ type }).find((asset) => asset.id === assetId);
  const items: DescriptionsProps['items'] = [
    {
      label: Translation.get('common.type'),
      children: Translation.get(MonitoringPointType.Key.getLabel(type))
    }
  ];
  if (parent) {
    items.push({ label: Translation.get('asset.parent'), children: parent.name });
  }
  if (attributes) {
    const fields = MonitoringPointType.Key.getAttributes(type);
    fields.forEach(({ label, name, translatingUnit, type, options, unit }) => {
      const children = attributes[name as keyof MonitoringPointAttributes];
      if (type === 'string') {
        items.push({
          label: Translation.get(label),
          children
        });
      } else if (type === 'enum' && options && options.length > 0) {
        items.push({
          label: Translation.get(label),
          children: Translation.get(getOptionLabelByValue(options, children))
        });
      } else {
        items.push({
          label: Translation.get(label),
          children: getValue({
            value: children as number,
            unit: translatingUnit
              ? Translation.get(formatUnitTranslationKeyWithPlural(children, translatingUnit))
              : unit
          })
        });
      }
    });
  }
  return (
    <MutedCard title={Translation.get('asset')}>
      <Descriptions
        items={items}
        contentStyle={{ justifyContent: 'flex-start' }}
        layout='vertical'
      />
    </MutedCard>
  );
};
