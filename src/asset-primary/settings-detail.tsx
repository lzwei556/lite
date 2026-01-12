import { AssetCategory } from 'common/asset-category';
import intl from 'react-intl-universal';
import { getOptionLabelByValue, getValue, truncate } from '../utils';
import { Descriptions, DescriptionsProps, MutedCard } from '../components';
import { FieldHelper } from 'types';
import { Col } from 'antd';

export const SettingsDetail = ({ attributes, type }: { attributes: any; type: number }) => {
  const items: DescriptionsProps['items'] = [];
  if (attributes) {
    const settings = AssetCategory.Key.getSettings(type);
    if (settings.length > 0) {
      settings[0].fields
        .filter((field) => (field.visibleWhen ? field.visibleWhen(attributes) : true))
        .filter((_, i) => i < 10)
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
  if (items.length > 0) {
    return (
      <Col span={24}>
        <MutedCard title={intl.get('BASIC_INFORMATION')}>
          <Descriptions items={items} style={{ overflowY: 'auto', maxHeight: 400 }} />
        </MutedCard>
      </Col>
    );
  } else {
    return null;
  }
};
