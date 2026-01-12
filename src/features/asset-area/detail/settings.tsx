import React from 'react';
import { Button, Empty, Space, TableProps } from 'antd';
import intl from 'react-intl-universal';
import { uniq } from 'lodash';
import { Card, DeleteIconButton, EditIconButton, Link } from '../../../components';
import { ASSET_PATHNAME, AssetRow, deleteAsset } from '../../../asset-common';
import { ActionBar } from '../actionBar';
import { CanAccess, Permission } from '../../../providers/access-control';
import { PrimaryAssetTable } from './primary-asset-table';
import { AssetCategory } from 'common/asset-category';

export type Column = NonNullable<TableProps<AssetRow>['columns']>[0];
type Props = {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (asset: AssetRow) => void;
};

export const Settings = (props: Props) => {
  const { asset, ...rest } = props;
  const { children } = asset;
  const types = uniq(children?.map((a) => a.type));

  const nameColun: Column = {
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

  if (!children || children.length === 0) {
    return (
      <Card extra={getExtra(props)} title={intl.get('ASSET')}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  } else if (types.length === 1) {
    return (
      <Card extra={getExtra(props)} title={intl.get('ASSET')}>
        <PrimaryAssetTable
          assets={children.map(({ children, ...rest }) => rest)}
          column={{ name: nameColun, operation: operationColumn }}
          type={types[0]}
        />
      </Card>
    );
  } else {
    return (
      <TabbedTable
        {...props}
        children={children}
        column={{ name: nameColun, operation: operationColumn }}
        key={types.join()}
        types={types}
      />
    );
  }
};

const getExtra = (props: Props, setActiveKey?: React.Dispatch<React.SetStateAction<string>>) => {
  return (
    <CanAccess {...Permission.AssetAdd}>
      <Button.Group>
        <ActionBar
          {...{
            ...props,
            onSuccess: (type) => {
              props.onSuccess();
              setActiveKey?.(`${type}`);
            }
          }}
        />
      </Button.Group>
    </CanAccess>
  );
};

const TabbedTable = ({
  children,
  column,
  types,
  ...rest
}: {
  children: AssetRow[];
  column: { name: Column; operation: Column };
  types: number[];
} & Props) => {
  const [activeKey, setActiveKey] = React.useState(`${types[types.length - 1]}`);

  return (
    <Card
      activeTabKey={activeKey}
      onTabChange={setActiveKey}
      tabBarExtraContent={getExtra(rest, setActiveKey)}
      tabList={types.map((t) => {
        const assets = children.filter((asset) => asset.type === t);
        const typeLabel = AssetCategory.Key.getlabelPlural(t);
        const label = typeLabel ? intl.get(typeLabel) : intl.get('ASSET');
        return {
          key: `${t}`,
          label,
          children: (
            <PrimaryAssetTable assets={assets} column={column} key={assets.length} type={t} />
          )
        };
      })}
    />
  );
};
