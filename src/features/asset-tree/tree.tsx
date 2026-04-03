import { Spin, Tree, Typography } from 'antd';
import { AssetRow } from 'asset-common/types';
import { MonitoringPointRow } from 'monitoring-point/types';
import { useAssetsContext } from 'providers/assets';
import { useNavigate } from 'react-router-dom';
import { mapTree } from 'utils/tree';
import { AssetTree as AssetTreeConfig } from 'domain/asset';

export const AssetTree = ({
  height,
  onClick,
  selectedKeys,
  icon
}: {
  height?: number;
  onClick?: () => void;
  selectedKeys?: string[];
  icon: (node: AssetRow | MonitoringPointRow | undefined) => React.ReactNode;
}) => {
  const { assets, assetsLoading } = useAssetsContext();
  const navigate = useNavigate();
  const { root } = AssetTreeConfig.useVirturalAsset();
  const mixedTree = mapTree(
    [
      {
        ...root,
        children: assets
      } as AssetRow
    ],
    (asset) => AssetTreeConfig.combine(asset)
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
              <Typography.Text ellipsis={true} style={{ maxWidth: 200 }}>
                {name}
              </Typography.Text>
            );
          }}
          onClick={onClick}
          onSelect={(_, e: any) => {
            const { id, type } = e.node;
            navigate(`/${AssetTreeConfig.Path.Assets}/${AssetTreeConfig.pickId(id)}-${type}`);
          }}
          selectedKeys={selectedKeys}
          defaultExpandAll={true}
          height={height}
        />
      )}
    </Spin>
  );
};
