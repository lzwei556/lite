import React from 'react';
import { AssetRow, updateAsset, uploadAssetImage } from '../../asset-common';
import { useAssetModelContext, usePlaceCards } from '../../asset-model';
import { base64toBlob } from '../../utils/image';
import { Canvas } from './canvas';
import { Toolbar } from './toolbar';

export const AssetAnnotationImage = ({
  asset,
  backgroundImage,
  editable,
  title,
  onSuccess
}: {
  asset: AssetRow;
  backgroundImage: string;
  editable?: boolean;
  title?: React.ReactNode;
  onSuccess?: () => void;
}) => {
  const { selectedMonitoringPoint } = useAssetModelContext();
  const selected = !editable;
  const placeCardProps = usePlaceCards(asset, selected);
  const [uploadingImg, setUploadingImg] = React.useState<string>();

  return (
    <Canvas
      background={
        asset.image
          ? `http://172.16.7.134:8268/images/${asset.image}`
          : uploadingImg ?? backgroundImage
      }
      selectedItem={
        selected ? { ...selectedMonitoringPoint, index: selectedMonitoringPoint?.id } : undefined
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
