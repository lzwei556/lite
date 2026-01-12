import React from 'react';
import { AssetCategory } from 'common/asset-category';
import intl from 'react-intl-universal';
import { SelectProps, Space, TableProps } from 'antd';
import { FieldHelper } from 'types';
import { SettingsField } from 'common/asset-category/settings';
import { ASSET_PATHNAME, AssetRow, deleteAsset } from 'asset-common';
import { getDisplayName, getOptionLabelByValue } from 'utils';
import { useLocaleContext } from 'localeProvider/context';
import { DeleteIconButton, EditIconButton, LightSelectFilter, Link, Table } from 'components';
import { CanAccess, Permission } from 'providers/access-control';

type Props = {
  assets: AssetRow[];
  type: number;
  onSuccess: () => void;
  onUpdate: (asset: AssetRow) => void;
};

export const PrimaryAssetSettingsTable = (props: Props) => {
  const { assets, type } = props;
  const category = AssetCategory.Key.get(type);
  const filterField = category?.filter;
  const { dsFilter, selectProps, values } = useFilter(assets, filterField);
  const columns = useColumns({ ...props, category, values });

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

type Column = NonNullable<TableProps<AssetRow>['columns']>[0];
const useColumns = ({
  category,
  values,
  ...rest
}: Props & { category: AssetCategory.Config | null; values: any }) => {
  const nameColumn: Column = {
    title: intl.get('NAME'),
    dataIndex: 'name',
    render: (_, row: AssetRow) => (
      <Link
        style={{ display: 'inline-block', minWidth: 160 }}
        to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`}
      >
        {row.name}
      </Link>
    )
  };
  const operationColumn: Column = {
    title: intl.get('OPERATION'),
    key: 'action',
    render: (row: AssetRow) => (
      <Space>
        <CanAccess {...Permission.AssetEdit}>
          <EditIconButton onClick={() => rest.onUpdate(row)} />
        </CanAccess>
        <CanAccess {...Permission.AssetDelete}>
          <DeleteIconButton
            confirmProps={{
              description: intl.get('DELETE_SOMETHING_PROMPT', { something: row.name }),
              onConfirm: () => deleteAsset(row.id).then(rest.onSuccess)
            }}
          />
        </CanAccess>
      </Space>
    )
  };
  const settings = category?.settings ?? [];
  const filterField = category?.filter;

  const { language } = useLocaleContext();
  const cols: Column[] = [nameColumn];
  if (settings.length > 0) {
    const settingsColumns = settings[0].fields
      .filter((field) => (filterField && field.visibleWhen ? field.visibleWhen(values) : true))
      .map(({ label, name, options, source, unit, type }) => {
        const common = {
          dataIndex: AssetCategory.getNamePath(source).concat(FieldHelper.getNamePath(name)),
          key: name,
          title: () => getDisplayName({ name: intl.get(label), lang: language, suffix: unit })
        };
        if (options) {
          return {
            ...common,
            render: (value: string) => intl.get(getOptionLabelByValue(options, value)).d(value)
          };
        } else if (type === 'number-array') {
          return {
            ...common,
            render: (value: number[]) => (value ?? []).join()
          };
        } else {
          return common;
        }
      });
    cols.push(...settingsColumns);
  }
  cols.push(operationColumn);
  return cols;
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
          options: field.options?.map((opt) => ({ ...opt, label: intl.get(opt.label) })),
          prefix: intl.get(field.label)
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
