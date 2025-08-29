import React from 'react';
import { useSize } from 'ahooks';
import { Card } from '../../components';
import { AssetRow, updateAsset, uploadAssetImage } from '../../asset-common';
import { useAssetModelContext, usePlaceCards } from '../../asset-model';
import { base64toBlob } from '../../utils/image';
import { Canvas } from './canvas';
import { Toolbar } from './toolbar';

export const AssetAnnotationImage = ({
  asset,
  backgroundImage,
  editable,
  title
}: {
  asset: AssetRow;
  backgroundImage: string;
  editable?: boolean;
  title?: React.ReactNode;
}) => {
  const ref = React.useRef(null);
  const size = useSize(ref);
  const { selectedMonitoringPoint } = useAssetModelContext();
  const selected = !editable;
  const placeCardProps = usePlaceCards(asset, selected);
  const getHeight = (height: number) => {
    const min = 600;
    const max = 800;
    return height < min ? min : height > max ? max : height;
  };
  const [uploadingImg, setUploadingImg] = React.useState<string>();

  return (
    <Card
      ref={ref}
      style={{ height: '100%' }}
      styles={{ body: { padding: 0 } }}
      title={title}
      extra={
        editable && (
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
                });
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
      }
    >
      {size && (
        <Canvas
          size={{ ...size, height: getHeight(size.height) }}
          background={
            asset.image
              ? `http://172.16.7.134:8268/images/${asset.image}`
              : uploadingImg ?? backgroundImage
          }
          selectedItem={
            selected
              ? { ...selectedMonitoringPoint, index: selectedMonitoringPoint?.id }
              : undefined
          }
          placeCardProps={placeCardProps}
          editable={editable}
        />
      )}
    </Card>
  );
};
