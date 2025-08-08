import * as React from 'react';
import { Breadcrumb, BreadcrumbProps, Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { mapTree, tree2List } from '../../utils/tree';
import { truncate } from '../../utils/format';
import { AssetTreeNode, combine, pickId } from '../../views/home/tree';
import { MonitoringPointRow } from '../../monitoring-point';
import { AssetRow } from '../types';
import { ASSET_PATHNAME, getVirturalAsset } from '../constants';
import { useContext } from './context';
import { Link } from '../../components';
import { AssetStatusTag } from '../assetStatusTag';

export type TreeFlatListItem = AssetTreeNode & { path: number[] };

export const AssetNavigator = ({
  asset,
  showStatus = true
}: { asset: AssetRow | MonitoringPointRow } & { showStatus?: Boolean }) => {
  const { id, type, alertLevel } = asset;
  const items: BreadcrumbProps['items'] = [];
  const { assets } = useContext();

  if (assets.length > 0) {
    const root = {
      ...getVirturalAsset().root,
      children: assets
    } as AssetRow;
    const list: TreeFlatListItem[] = tree2List(mapTree([root], (node) => combine(node)));
    if (list.length > 0) {
      const paths = list.find((item) => pickId(item.id) === id && item.type === type)?.path;
      if (paths && paths.length > 0) {
        items.push(
          ...paths
            ?.map((id) => list.find((item) => id === item.id))
            .map((mix, index) => ({
              title: mix && (
                <BreadcrumbItemTitle
                  isLast={paths.length - 1 === index}
                  mix={{ ...mix, name: truncate(mix.name, 30) }}
                  list={list}
                />
              )
            }))
        );
      }
    }
  }

  return (
    <Space style={{ minWidth: items.length * 150 }} size={20}>
      <Breadcrumb items={items} />
      {showStatus && <AssetStatusTag status={alertLevel ?? 0} />}
    </Space>
  );
};

function BreadcrumbItemTitle({
  mix,
  isLast,
  list
}: {
  isLast: boolean;
  mix: TreeFlatListItem;
  list: TreeFlatListItem[];
}) {
  const { id, name, parentId, type } = mix;
  const downIcon = <DownOutlined style={{ fontSize: '10px', cursor: 'pointer' }} />;
  const siblings = list.filter((item) => item.id !== id && item.parentId === parentId);
  const items: MenuProps['items'] = siblings.map(({ id, name, type }) => ({
    key: id,
    label: <ItemLink {...{ id, name, type }} />
  }));
  if (isLast) {
    if (siblings.length > 0) {
      return (
        <Dropdown menu={{ items }} trigger={['click']}>
          <Space>
            <span>{name}</span>
            {downIcon}
          </Space>
        </Dropdown>
      );
    } else {
      return (
        <Space>
          <span>{name}</span>
        </Space>
      );
    }
  } else {
    return (
      <Space>
        <ItemLink {...{ id, name, type }} />
        {siblings.length > 0 && id !== 0 && (
          <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight'>
            {downIcon}
          </Dropdown>
        )}
      </Space>
    );
  }
}

function ItemLink({ id, type, name }: Pick<TreeFlatListItem, 'id' | 'name' | 'type'>) {
  return <Link to={`/${ASSET_PATHNAME}/${pickId(id)}-${type}`}>{name}</Link>;
}
