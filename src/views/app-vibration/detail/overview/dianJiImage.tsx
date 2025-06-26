import React from 'react';
import { Button, Checkbox, Col, List, Popover, Tooltip, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { DisplayProperty } from '../../../../constants/properties';
import { Dayjs } from '../../../../utils';
import { ImageAnnotation } from '../../../../features';
import { Card, Flex, Grid, Link } from '../../../../components';
import { ASSET_PATHNAME, AssetRow, updateAsset } from '../../../asset-common';
import DianJi from './dianji.png';
import './style.css';
import { getPropertyValues, MonitoringPointPropertyItem } from '.';

export const DianJiImage = ({
  asset,
  properties,
  onSelectMonitoringPointProperty,
  viewIcon
}: {
  asset: AssetRow;
  properties: DisplayProperty[];
  onSelectMonitoringPointProperty?: (item: MonitoringPointPropertyItem) => void;
  viewIcon: React.ReactElement;
}) => {
  const ref = React.useRef(null);
  const size = useSize(ref);

  const [visibledKeys, setVisibledKeys] = React.useState<string[]>(
    properties.filter((p) => !!p.first).map((p) => p.key)
  );
  const [selected, setSelected] = React.useState<MonitoringPointPropertyItem | undefined>();

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
        <ImageAnnotation
          asset={asset}
          size={size}
          background={DianJi}
          placeTexts={(asset.monitoringPoints ?? []).map((m) => ({
            id: m.id,
            header: <Link to={`/${ASSET_PATHNAME}/${m.id}-${m.type}`}>{m.name}</Link>,
            body: (
              <List
                className='asset-image-annotation-list'
                dataSource={getPropertyValues(
                  m,
                  properties.filter((p) => visibledKeys.includes(p.key))
                )}
                rowKey={(item) => `${item.key}_${item.axisKey}`}
                renderItem={(item) => {
                  const { axisKey, key, label, children } = item;
                  const isSelected =
                    selected?.id === m.id && selected?.key === key && selected?.axisKey === axisKey;
                  return (
                    <List.Item
                      className={`asset-image-annotation-list-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        const mix = {
                          ...m,
                          ...item,
                          property: properties.find((p) => p.key === key)!
                        };
                        setSelected(mix);
                        onSelectMonitoringPointProperty?.(mix);
                      }}
                      style={{ border: 0 }}
                    >
                      <Flex align='center' justify='space-between' style={{ width: '100%' }}>
                        <Typography.Text type='secondary' style={{ fontSize: 12 }}>
                          {label}
                        </Typography.Text>
                        <span style={{ fontSize: 12 }}>{children}</span>
                      </Flex>
                    </List.Item>
                  );
                }}
                size='small'
              />
            ),
            footer: m.data?.timestamp ? Dayjs.format(m.data.timestamp) : undefined
          }))}
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
      <Tooltip title={intl.get('SETTINGS')}>
        <Button icon={<SettingOutlined />} />
      </Tooltip>
    </Popover>
  );
}
