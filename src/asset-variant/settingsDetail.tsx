import { AssetCategory } from '../asset-category';
import intl from 'react-intl-universal';
import { getOptionLabelByValue, getValue } from '../utils';
import { Descriptions, DescriptionsProps } from '../components';

export const SettingsDetail = ({ attributes, type }: { attributes: any; type: number }) => {
  const items: DescriptionsProps['items'] = [];
  if (attributes) {
    const settings = AssetCategory.Key.getSettings(type);
    if (settings.length > 0) {
      settings[0].fields
        .filter((field) => (field.visibleWhen ? field.visibleWhen(attributes) : true))
        .forEach(({ label, name, translatingUnit, type, options, unit }) => {
          const children = attributes[name];
          if (type === 'string') {
            items.push({
              label: intl.get(label),
              children
            });
          } else if (options && options.length > 0) {
            const value = getOptionLabelByValue(options, children);
            items.push({
              label: intl.get(label),
              children: intl.get(value).d(value)
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
  return <Descriptions items={items} />;
};
