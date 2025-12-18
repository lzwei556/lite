import React from 'react';
import { AssetRow, updateAsset, uploadAssetImage } from '../../asset-common';
import { getDefaultImage, useAssetModelContext, usePlaceCards } from '../../asset-model';
import { base64toBlob } from '../../utils/image';
import { Canvas } from './canvas';
import { Toolbar } from './toolbar';
import { ToolbarLegacy } from './toolbar-legacy';
import { ENV } from '../../utils';

export const AssetAnnotationImage = ({
  asset,
  editable,
  title,
  onSuccess,
  viewIcon
}: {
  asset: AssetRow;
  editable?: boolean;
  title?: React.ReactNode;
  onSuccess?: () => void;
  viewIcon?: React.ReactNode;
}) => {
  const { selectedMonitoringPoint } = useAssetModelContext();
  const selected = !editable;
  const placeCardProps = usePlaceCards(selected);
  const [uploadingImg, setUploadingImg] = React.useState<string>();

  const getBackgroundImage = () => {
    if (asset.image) {
      return `/images/${asset.image}`;
    } else if (uploadingImg) {
      return uploadingImg;
    } else {
      return getDefaultImage(asset);
    }
  };

  const isLegacy = ENV.legacyEnabled === 'true';

  return (
    <Canvas
      background={getBackgroundImage()}
      selectedItem={
        selectedMonitoringPoint
          ? { ...selectedMonitoringPoint, index: selectedMonitoringPoint?.self?.id }
          : undefined
      }
      placeCardProps={placeCardProps}
      initials={asset.attributes?.canvasSnapshot}
      cardProps={{
        title,
        extra: editable && (
          <Toolbar
            {...{
              onSave: (snapshot) => {
                updateAsset(asset.id, {
                  id: asset.id,
                  name: asset.name,
                  parent_id: asset.parentId,
                  type: asset.type,
                  //@ts-ignore
                  attributes: { ...asset.attributes, ...snapshot }
                }).then(() => onSuccess?.());
              },
              onUpload: (image) => {
                base64toBlob(image).then((blob) => {
                  uploadAssetImage(asset.id, blob);
                });
              },
              beforeUpload: setUploadingImg,
              uploadedImageStr: uploadingImg
            }}
          />
        )
      }}
      editable={isLegacy ? !!uploadingImg : editable}
      legacyToolbar={
        isLegacy && (
          <ToolbarLegacy
            {...{
              onSave: (snapshot) => {
                updateAsset(asset.id, {
                  id: asset.id,
                  name: asset.name,
                  parent_id: asset.parentId,
                  type: asset.type,
                  //@ts-ignore
                  attributes: { ...asset.attributes, ...snapshot }
                }).then(() => onSuccess?.());
              },
              onUpload: (image) => {
                base64toBlob(image).then((blob) => {
                  uploadAssetImage(asset.id, blob);
                });
              },
              onCancel: () => setUploadingImg(undefined),
              beforeUpload: setUploadingImg,
              uploadedImageStr: uploadingImg,
              viewIcon
            }}
          />
        )
      }
    />
  );
};
