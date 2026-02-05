import { Empty } from 'antd';
import { AssetRow } from 'asset-common';
import { Card, IconButton } from 'components';
import { uniq } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { PrimaryAssetSettingsTable } from './settings-table';
import { AssetCategory } from 'common/asset-category';
import { CanAccess, Permission } from 'providers/access-control';
import { PlusOutlined } from '@ant-design/icons';

export type Props = {
  asset: AssetRow;
  onDeleteSuccess: (id: number) => void;
  openCreate: () => void;
  openUpdate: (asset: AssetRow) => void;
  createFormModal: React.ReactNode;
  updateFormModal: React.ReactNode;
  canEdit: boolean;
};

export const SettingsTableTabs = (props: Props) => {
  const { asset, ...rest } = props;
  const { children } = asset;
  const types = uniq(children?.map((a) => a.type));

  if (!children || children.length === 0) {
    return (
      <Card extra={getExtra(props)} title={intl.get('ASSET')}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  } else if (types.length === 1) {
    return (
      <Card extra={getExtra(props)} title={intl.get('ASSET')}>
        <PrimaryAssetSettingsTable
          {...rest}
          assets={children.map(({ children, ...rest }) => rest)}
          type={types[0]}
        />
        {rest.canEdit && rest.updateFormModal}
      </Card>
    );
  } else {
    return <TabbedTable {...props} children={children} key={types.join()} types={types} />;
  }
};

const getExtra = (props: Props, setActiveKey?: React.Dispatch<React.SetStateAction<string>>) => {
  return (
    <CanAccess {...Permission.AssetAdd}>
      <>
        <IconButton
          icon={<PlusOutlined />}
          onClick={props.openCreate}
          color='primary'
          size='small'
          variant='outlined'
        />
        {props.createFormModal}
      </>
    </CanAccess>
  );
};

const TabbedTable = ({
  children,
  types,
  ...rest
}: {
  children: AssetRow[];
  types: number[];
} & Props) => {
  const [activeKey, setActiveKey] = React.useState(`${types[types.length - 1]}`);

  return (
    <>
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
              <PrimaryAssetSettingsTable {...rest} assets={assets} key={assets.length} type={t} />
            )
          };
        })}
      />
      {rest.canEdit && rest.updateFormModal}
    </>
  );
};
