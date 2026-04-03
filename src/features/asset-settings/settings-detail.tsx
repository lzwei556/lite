import intl from 'react-intl-universal';
import { getOptionLabelByValue, getValue, truncate } from 'utils';
import { Descriptions, DescriptionsProps } from 'components';
import { FieldHelper } from 'types';
import { PrimaryAssetType } from 'domain/asset';

export const PrimaryAssetSettingsDetail = ({
  attributes,
  type,
  groups = [PrimaryAssetType.SettingsGroup.Motor],
  maxHeight = 400,
  ...rest
}: DescriptionsProps & {
  attributes: any;
  type: number;
  groups?: number[];
  maxHeight?: number;
}) => {
  const items: DescriptionsProps['items'] = [];
  if (attributes) {
    const settings = PrimaryAssetType.getSettings(type);
    if (settings.length > 0) {
      settings
        .filter((field) => (field.visibleWhen ? field.visibleWhen(attributes) : true))
        .filter((field) => (groups.length > 0 && field.group ? groups.includes(field.group) : true))
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
              children: truncate(((children ?? []) as number[]).join('-'), 20)
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
  return <Descriptions {...rest} items={items} style={{ overflowY: 'auto', maxHeight }} />;
};
