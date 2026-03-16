import React from 'react';
import { Column } from './settings';
import { AssetCategory } from '../../../asset-category';
import { getOptionLabelByValue } from '../../../utils';
import { Translation } from 'locales/utils';
import { LightSelectFilter, Table } from '../../../components';
import { AssetRow } from '../../../asset-common';
import { SelectProps, Space } from 'antd';
import { SettingsField } from '../../../asset-category/settings';
import { FieldHelper } from 'types';
import { useI18n } from 'providers/i18n';
import { getDisplayName } from 'locales/utils';

export const PrimaryAssetTable = ({
  assets,
  column,
  type
}: {
  assets: AssetRow[];
  column: { name: Column; operation: Column };
  type: number;
}) => {
  const { language } = useI18n();
  const cols = [column.name];
  const category = AssetCategory.Key.get(type);
  const settings = category?.settings ?? [];
  const filterField = category?.filter;
  const { dsFilter, selectProps, values } = useFilter(assets, filterField);
  if (settings.length > 0) {
    const settingsColumns = settings
      .filter((field) => (filterField && field.visibleWhen ? field.visibleWhen(values) : true))
      .filter(
        (field) => field.group === `asset.${AssetCategory.Value[type].toLowerCase()}.parameters`
      )
      .map(({ label, name, options, source, unit, type }) => {
        const common = {
          dataIndex: AssetCategory.getNamePath(source).concat(FieldHelper.getNamePath(name)),
          key: name,
          title: () =>
            getDisplayName({ name: Translation.get(label), lang: language, suffix: unit })
        };
        if (options) {
          return {
            ...common,
            render: (value: string) => Translation.get(getOptionLabelByValue(options, value))
          };
        } else if (type === 'number-array') {
          return {
            ...common,
            render: (value: number[]) => (value ?? []).join('-')
          };
        } else {
          return common;
        }
      });
    cols.push(...settingsColumns);
  }
  cols.push(column.operation);

  return (
    <Table
      cardProps={{
        title: filterField && (
          <Space style={{ paddingBottom: 16 }}>
            <LightSelectFilter {...selectProps} allowClear={false} />
          </Space>
        )
      }}
      columns={cols}
      dataSource={assets.filter(dsFilter)}
      pagination={false}
      rowKey={(row) => row.id}
    />
  );
};

const useFilter = (assets: AssetRow[], field?: SettingsField) => {
  const [filter, setFilter] = React.useState(
    getFieldValue(assets[assets.length - 1], field) ?? field?.defaultValue
  );

  return {
    dsFilter: (asset: AssetRow) => (field ? getFieldValue(asset, field) === filter : true),
    selectProps: field
      ? ({
          defaultValue: filter,
          onChange: setFilter,
          options: field.options?.map((opt) => ({ ...opt, label: Translation.get(opt.label) })),
          prefix: Translation.get(field.label)
        } as SelectProps)
      : undefined,
    values: field ? { [field.name]: filter } : undefined
  };
};

const getFieldValue = (asset?: AssetRow, field?: SettingsField) => {
  if (asset && field) {
    return asset.attributes?.[field.name as keyof typeof asset.attributes];
  }
  return null;
};
