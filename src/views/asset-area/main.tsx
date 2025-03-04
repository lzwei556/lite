import React from 'react';
import { Spin } from 'antd';
import { Asset, AssetRow, ContextProps } from '../asset-common';
import { UpdateAssetModal } from '../asset-variant';
import * as Detail from './detail';
import { UpdateModal } from './updateModal';
import { useAssetCategories } from './utils';

export const Main = ({ loading, selectedNode, refresh }: ContextProps) => {
  const [open, setOpen] = React.useState(false);
  const [asset, setAsset] = React.useState<AssetRow | undefined>();
  const assetCategories = useAssetCategories();

  const reset = () => {
    setOpen(false);
    setAsset(undefined);
  };

  const modalProps = {
    open,
    onCancel: reset,
    onSuccess: () => {
      refresh();
      reset();
    }
  };
  const updateModalProps = {
    ...modalProps,
    asset
  };

  let ele: React.ReactNode = null;
  if (selectedNode) {
    if (Asset.Assert.isArea(selectedNode.type)) {
      ele = (
        <Detail.Index
          asset={selectedNode as AssetRow}
          onSuccess={refresh}
          onUpdateAsset={(asset) => {
            setOpen(true);
            setAsset(asset);
          }}
        />
      );
    }
  }

  return (
    <Spin spinning={loading}>
      {ele}
      {asset && Asset.Assert.isArea(asset.type) && (
        <UpdateModal {...updateModalProps} asset={asset} />
      )}
      {asset && !Asset.Assert.isArea(asset.type) && (
        <UpdateAssetModal {...updateModalProps} asset={asset} types={assetCategories} />
      )}
    </Spin>
  );
};
