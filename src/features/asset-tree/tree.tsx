import { Spin, Tree, Typography } from 'antd';
import { AssetRow } from 'asset-common/types';
import { useAssetsContext } from 'providers/assets';
import { useNavigate } from 'react-router-dom';
import { mapTree } from 'utils/tree';
import { Hooks, AssetTree as AT } from 'domain/asset';
import * as MonitoringPoint from 'domain/monitoring-point';

export const AssetTree = ({
  height,
  onClick,
  selectedKeys,
  icon
}: {
  height?: number;
  onClick?: () => void;
  selectedKeys?: string[];
  icon: (node: AssetRow | MonitoringPoint.Types.Entity | undefined) => React.ReactNode;
}) => {
  const { assets, assetsLoading } = useAssetsContext();
  const navigate = useNavigate();
  const { root } = Hooks.useVirturalAsset();
  const mixedTree = mapTree(
    [
      {
        ...root,
        children: assets
      } as AssetRow
    ],
    (asset) => AT.combine(asset)
  );
  const treedata = mapTree(mixedTree, (mix) => {
    const { id, type } = mix;
    return {
      ...mix,
      key: type < 10000 ? `${id}-${type}` : `${id}`,
      icon
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
              <Typography.Text ellipsis={true} style={{ maxWidth: 175 }}>
                {name}
              </Typography.Text>
            );
          }}
          onClick={onClick}
          onSelect={(_, e: any) => {
            const { id, type } = e.node;
            navigate(`/${AT.Path.Assets}/${AT.pickId(id)}-${type}`);
          }}
          selectedKeys={selectedKeys}
          defaultExpandAll={true}
          height={height}
        />
      )}
    </Spin>
  );
};
