import React from 'react';
import { Checkbox, Col, Popover } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { Canvas } from '../../../imageAnnotation';
import { DisplayProperty } from '../../../../constants/properties';
import { base64toBlob } from '../../../../utils/image';
import { Card, Grid, IconButton } from '../../../../components';
import { AssetRow, updateAsset, uploadAssetImage } from '../../../../asset-common';
import { useAssetModelContext, usePlaceCards } from '../../../../asset-model';
import DianJi from './dianji.png';

export const DianJiImage = ({
  asset,
  viewIcon,
  onSuccess
}: {
  asset: AssetRow;
  viewIcon: React.ReactElement;
  onSuccess: () => void;
}) => {
  const ref = React.useRef(null);
  const size = useSize(ref);
  const { selectedMonitoringPoint, selectedMonitoringPointExtend } = useAssetModelContext();
  const properties = selectedMonitoringPointExtend?.properties ?? [];
  const [visibledKeys, setVisibledKeys] = React.useState<string[]>(
    properties.filter((p) => !!p.first).map((p) => p.key)
  );
  const placeCardProps = usePlaceCards(asset, visibledKeys);

  return (
    <Card
      ref={ref}
      style={{ height: '100%' }}
      styles={{
        body: {
          padding: 0,
          height: '100%'
        }
      }}
    >
      {size && (
        <Canvas
          size={size}
          background={asset.image ? `/images/${asset.image}` : DianJi}
          selectedItem={{ ...selectedMonitoringPoint, index: selectedMonitoringPoint?.id }}
          placeCardProps={placeCardProps}
          textSettingBtn={
            <SettingsButton
              properties={properties}
              visibledKeys={visibledKeys}
              setVisibledKeys={setVisibledKeys}
            />
          }
          onSave={(snapshot) => {
            updateAsset(asset.id, {
              id: asset.id,
              name: asset.name,
              parent_id: asset.parentId,
              type: asset.type,
              //@ts-ignore
              attributes: { ...asset.attributes, ...snapshot }
            }).then(onSuccess);
          }}
          onUpload={(image) => {
            base64toBlob(image).then((blob) => {
              uploadAssetImage(asset.id, blob);
            });
          }}
          toolbarExtras={[viewIcon]}
        />
      )}
    </Card>
  );
};

function SettingsButton({
  properties = [],
  visibledKeys,
  setVisibledKeys
}: {
  properties: DisplayProperty[];
  visibledKeys: string[];
  setVisibledKeys: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <Popover
      content={
        <Checkbox.Group value={visibledKeys} onChange={setVisibledKeys} style={{ width: '100%' }}>
          <Grid gutter={[0, 0]} style={{ width: 500 }}>
            {properties.map((p) => (
              <Col span={24} key={p.key}>
                <Checkbox value={p.key} disabled={!!p.first}>
                  {intl.get(p.name)}
                </Checkbox>
              </Col>
            ))}
          </Grid>
        </Checkbox.Group>
      }
      overlayStyle={{ maxWidth: 300 }}
      placement='leftBottom'
      trigger='click'
    >
      <IconButton icon={<SettingOutlined />} tooltipProps={{ title: intl.get('SETTINGS') }} />
    </Popover>
  );
}
