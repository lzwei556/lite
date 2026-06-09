import React from 'react';
import intl from 'react-intl-universal';
import { SelectProps, Space } from 'antd';
import { AssetRow } from 'asset-common';
import { LightSelectFilter, Table } from 'components';
import { Props as TabsProps } from './settings-table-tabs';
import { useColumns } from './columns';
import { PrimaryAsset } from 'domains/asset';

type Props = Omit<TabsProps, 'asset'> & { assets: AssetRow[]; type: number };

export const PrimaryAssetSettingsTable = (props: Props) => {
  const { assets, canEdit, type } = props;
  const category = PrimaryAsset.get(type);
  const filterField = category?.filter;
  const { dsFilter, selectProps, values } = useFilter(assets, filterField);
  const columns = useColumns({ ...props, category, canEdit, values });

  return (
    <Table
      cardProps={{
        title: filterField && (
          <Space style={{ paddingBottom: 16 }}>
            <LightSelectFilter {...selectProps} allowClear={false} />
          </Space>
        )
      }}
      columns={columns}
      dataSource={assets.filter(dsFilter)}
      pagination={false}
      rowKey={(row) => row.id}
    />
  );
};

const useFilter = (assets: AssetRow[], field?: PrimaryAsset.Settings) => {
  const [filter, setFilter] = React.useState(
    getFieldValue(assets[assets.length - 1], field) ?? field?.defaultValue
  );

  return {
    dsFilter: (asset: AssetRow) => (field ? getFieldValue(asset, field) === filter : true),
    selectProps: field
      ? ({
          defaultValue: filter,
          onChange: setFilter,
          options: field.options?.map((opt) => ({ ...opt, label: intl.get(opt.label) })),
          prefix: intl.get(field.label)
        } as SelectProps)
      : undefined,
    values: field ? { [field.name]: filter } : undefined
  };
};

const getFieldValue = (asset?: AssetRow, field?: PrimaryAsset.Settings) => {
  if (asset && field) {
    return asset.attributes?.[field.name as keyof typeof asset.attributes];
  }
  return null;
};
