import { Space, TableProps } from 'antd';
import { AssetRow, deleteAsset } from 'asset-common';
import { DeleteIconButton, EditIconButton, Link } from 'components';
import { AssetTree, PrimaryAsset } from 'domain/asset';
import { useLocaleContext } from 'localeProvider';
import { CanAccess, Permission, useCan } from 'providers/access-control';
import intl from 'react-intl-universal';
import { FieldHelper } from 'types';
import { getDisplayName, getOptionLabelByValue } from 'utils';

type Column = NonNullable<TableProps<AssetRow>['columns']>[0];

export const useColumns = ({
  category,
  canEdit,
  values,
  ...rest
}: {
  onDeleteSuccess: (id: number) => void;
  openCreate: () => void;
  openUpdate: (asset: AssetRow) => void;
  createFormModal: React.ReactNode;
  updateFormModal: React.ReactNode;
  category?: PrimaryAsset.Config;
  values?: any;
  canEdit: boolean;
}) => {
  const nameColumn: Column = {
    title: intl.get('NAME'),
    dataIndex: 'name',
    render: (_, row: AssetRow) => (
      <Link
        style={{ display: 'inline-block', minWidth: 160 }}
        to={`/${AssetTree.Path.Assets}/${row.id}-${row.type}`}
      >
        {row.name}
      </Link>
    )
  };
  const canDelete = useCan(Permission.AssetDelete);
  const operationColumn: Column = {
    title: intl.get('OPERATION'),
    key: 'action',
    render: (row: AssetRow) => (
      <Space>
        <CanAccess {...Permission.AssetEdit}>
          <EditIconButton onClick={() => rest.openUpdate(row)} />
        </CanAccess>
        <CanAccess {...Permission.AssetDelete}>
          <DeleteIconButton
            confirmProps={{
              description: intl.get('DELETE_SOMETHING_PROMPT', { something: row.name }),
              onConfirm: () => deleteAsset(row.id).then(() => rest.onDeleteSuccess(row.id))
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
    const settingsColumns = settings
      .filter((field) =>
        filterField && field.visibleWhen && values ? field.visibleWhen(values) : true
      )
      .map(({ label, name, options, unit, type }) => {
        const common = {
          dataIndex: FieldHelper.getNamePath(name),
          key: name,
          title: () => getDisplayName({ name: intl.get(label), lang: language, suffix: unit })
        };
        if (options) {
          return {
            ...common,
            render: (value: string) => {
              const label = getOptionLabelByValue(options, value);
              return label && label !== '-' && Number.isNaN(Number(label))
                ? intl.get(label).d(label)
                : value;
            }
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
  if (canEdit || canDelete) {
    cols.push(operationColumn);
  }
  return cols;
};
