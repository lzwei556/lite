import * as React from 'react';
import { Breadcrumb, BreadcrumbProps, Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { tree2List } from '../../utils/tree';
import { truncate } from '../../utils/format';
import { Link } from '../../components';
import { DeviceTreeNode, useDeviceTreeData } from './deviceTree';

export type TreeFlatListItem = DeviceTreeNode & { path: number[] };

export const DeviceNavigator = ({
  id,
  containerDomWidth
}: {
  id: number;
  containerDomWidth?: number;
}) => {
  const items: BreadcrumbProps['items'] = [];
  const treeData = useDeviceTreeData();
  const list: TreeFlatListItem[] = tree2List(treeData);
  if (list.length > 0) {
    const paths = list.find((item) => item.id === id)?.path;
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

  return (
    <Breadcrumb
      items={items.filter((item, index) =>
        containerDomWidth && containerDomWidth < 1300 ? index === items.length - 1 : true
      )}
    />
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
  const { id, name, parent } = mix;
  const downIcon = <DownOutlined style={{ fontSize: '10px', cursor: 'pointer' }} />;
  const siblings = list.filter((item) => item.id !== id && item.parent === parent);
  const items: MenuProps['items'] = siblings.map(({ id, name }) => ({
    key: id,
    label: <ItemLink {...{ id, name }} />
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
        <ItemLink {...{ id, name }} />
        {siblings.length > 0 && id !== 0 && (
          <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight'>
            {downIcon}
          </Dropdown>
        )}
      </Space>
    );
  }
}

function ItemLink({ id, name }: Pick<TreeFlatListItem, 'id' | 'name'>) {
  return <Link to={`/devices/${id}`}>{name}</Link>;
}
