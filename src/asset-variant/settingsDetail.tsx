import { AssetCategory } from '../asset-category';
import intl from 'react-intl-universal';
import { getOptionLabelByValue, getValue, truncate } from '../utils';
import { Descriptions, DescriptionsProps } from '../components';
import { FieldHelper } from 'types';

export const SettingsDetail = ({ attributes, type }: { attributes: any; type: number }) => {
  const items: DescriptionsProps['items'] = [];
  if (attributes) {
    const settings = AssetCategory.Key.getSettings(type);
    if (settings.length > 0) {
      settings
        .filter((field) => (field.visibleWhen ? field.visibleWhen(attributes) : true))
        .filter(
          (field) =>
            field.group === `asset.category.${AssetCategory.Value[type].toLowerCase()}.parameters`
        )
        .forEach(({ label, name, translatingUnit, type, options, unit }) => {
          const children = FieldHelper.getValue(attributes, name) as string | number | number[];
          if (type === 'string') {
            items.push({
              label: intl.get(label),
              children
            });
          } else if (options && options.length > 0) {
            const value = getOptionLabelByValue(options, children as string | number);
            items.push({
              label: intl.get(label),
              children: intl.get(value).d(value)
            });
          } else if (type === 'number-array') {
            items.push({
              label: intl.get(label),
              children: truncate(((children ?? []) as number[]).join(), 20)
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
  }
  return <Descriptions items={items} style={{ overflowY: 'auto', maxHeight: 400 }} />;
};
