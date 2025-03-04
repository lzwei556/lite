import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Tree, Typography } from 'antd';
import { mapTree } from '../../utils/tree';
import {
  ASSET_PATHNAME,
  AssetRow,
  getVirturalAsset,
  MonitoringPointRow,
  Points,
  useContext
} from '../asset-common';
import { Icon } from './icon';

export const AssetTree: React.FC<{
  height?: number;
  onClick?: () => void;
  selectedKeys?: string[];
}> = ({ height, onClick, selectedKeys }) => {
  const { assets, assetsLoading } = useContext();
  const navigate = useNavigate();
  const { root } = getVirturalAsset();
  const mixedTree = mapTree(
    [
      {
        ...root,
        children: assets
      } as AssetRow
    ],
    (asset) => combine(asset)
  );
  const treedata = mapTree(mixedTree, (mix) => {
    const { id, type } = mix;
    return {
      ...mix,
      key: type < 10000 ? `${id}-${type}` : `${id}`,
      icon: (node: AssetRow | MonitoringPointRow | undefined) => (
        <Icon node={node} height={18} width={18} style={{ position: 'relative', top: 3 }} />
      )
    };
  });

  return (
    <Spin spinning={assetsLoading}>
      {!assetsLoading && (
        <Tree
          treeData={treedata}
          fieldNames={{ key: 'key', title: 'name' }}
          showIcon={true}
          className='asset-list-tree'
          titleRender={(props: any) => {
            const { name } = props;
            return (
              <Typography.Text ellipsis={true} style={{ maxWidth: 140 }}>
                {name}
              </Typography.Text>
            );
          }}
          onClick={onClick}
          onSelect={(selectedKeys: any, e: any) => {
            const { id, type } = e.node;
            navigate(`/${ASSET_PATHNAME}/${pickId(id)}-${type}`);
          }}
          selectedKeys={selectedKeys}
          defaultExpandAll={true}
          height={height}
        />
      )}
    </Spin>
  );
};

export type AssetTreeNode = (Omit<AssetRow, 'children'> | MonitoringPointRow) & {
  children: (AssetRow | (Omit<MonitoringPointRow, 'id'> & { id: string | number }))[];
};

export function combine(asset: AssetRow): AssetTreeNode {
  const points = Points.filter(asset.monitoringPoints);
  const children = [
    ...sort(asset.children ?? []),
    ...points
      .map((p) => ({
        ...p,
        parentId: p.assetId,
        id: `${p.id}-${p.type}`
      }))
      .sort((prev, next) => {
        const { index: prevIndex } = prev.attributes || { index: 88 };
        const { index: nextIndex } = next.attributes || { index: 88 };
        return prevIndex - nextIndex;
      })
  ];
  return { ...asset, children };
}

function sort(assets: AssetRow[]) {
  return [...assets].sort(
    (prev, crt) =>
      (prev.attributes?.index ?? Number.MAX_VALUE) - (crt.attributes?.index ?? Number.MAX_VALUE)
  );
}

export function pickId(id: string | number) {
  if (typeof id === 'number') {
    return id;
  } else if (id.indexOf('-') > -1) {
    return Number(id.substring(0, id.indexOf('-')));
  }
  return 0;
}
