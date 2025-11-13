import React from 'react';
import { AssetRow, updateAsset, uploadAssetImage } from '../../asset-common';
import { getDefaultImage, useAssetModelContext, usePlaceCards } from '../../asset-model';
import { base64toBlob } from '../../utils/image';
import { Canvas } from './canvas';
import { Toolbar } from './toolbar';

export const AssetAnnotationImage = ({
  asset,
  editable,
  title,
  onSuccess
}: {
  asset: AssetRow;
  editable?: boolean;
  title?: React.ReactNode;
  onSuccess?: () => void;
}) => {
  const { selectedMonitoringPoint } = useAssetModelContext();
  const selected = !editable;
  const placeCardProps = usePlaceCards(selected);
  const getBackgroundImage = () => {
    if (asset.image) {
      return `/images/${asset.image}`;
    } else {
      return getDefaultImage(asset);
    }
  };
  const [uploadingImg, setUploadingImg] = React.useState<string>(getBackgroundImage());

  return (
    <Canvas
      background={uploadingImg}
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
      editable={editable}
    />
  );
};
