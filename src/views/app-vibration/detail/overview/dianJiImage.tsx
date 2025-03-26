import React from 'react';
import { Button, Checkbox, Col, Popover } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { getValue, roundValue, truncate } from '../../../../utils/format';
import { DisplayProperty } from '../../../../constants/properties';
import dayjs from '../../../../utils/dayjsUtils';
import { ImageAnnotation } from '../../../../features';
import { Card, Descriptions, Grid } from '../../../../components';
import { SelfLink } from '../../../../components/selfLink';
import { ASSET_PATHNAME, AssetRow, MonitoringPointRow, Point } from '../../../asset-common';
import DianJi from './dianji.png';
import RawImage from './raw.jpg';

export const DianJiImage = ({ asset }: { asset: AssetRow }) => {
  const ref = React.useRef(null);
  const size = useSize(ref);
  const getProperties = () => {
    let properties: DisplayProperty[] = [];
    if (asset.monitoringPoints && asset.monitoringPoints.length > 0) {
      const first = asset.monitoringPoints[0];
      properties = Point.getPropertiesByType(first.properties, first.type);
    }
    return properties;
  };

  const properties = getProperties();
  const [visibledKeys, setVisibledKeys] = React.useState<string[]>(
    properties.filter((p) => !!p.first).map((p) => p.key)
  );

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
          size={size}
          background={DianJi}
          rawImage={RawImage}
          placeTexts={(asset.monitoringPoints ?? []).map((m) => ({
            header: <SelfLink to={`/${ASSET_PATHNAME}/${m.id}-${m.type}`}>{m.name}</SelfLink>,
            body: (
              <Descriptions
                labelStyle={{ fontSize: 12 }}
                contentStyle={{ fontSize: 12 }}
                items={getPropertyValues(
                  m,
                  properties.filter((p) => visibledKeys.includes(p.key))
                ).map((item) => ({
                  ...item,
                  style: { paddingBottom: 2 }
                }))}
                column={1}
                size='small'
              />
            ),
            footer: m.data?.timestamp
              ? dayjs.unix(m.data.timestamp).local().format('YYYY-MM-DD HH:mm:ss')
              : undefined
          }))}
          textSettingBtn={
            <SettingsButton
              properties={properties}
              visibledKeys={visibledKeys}
              setVisibledKeys={setVisibledKeys}
            />
          }
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
      arrow={false}
      content={
        <Checkbox.Group value={visibledKeys} onChange={setVisibledKeys}>
          <Grid gutter={[0, 0]}>
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
      overlayStyle={{ maxWidth: 300, maxHeight: 600, overflow: 'auto' }}
      placement='leftBottom'
      trigger='click'
    >
      <Button icon={<SettingOutlined />} />
    </Popover>
  );
}

function getPropertyValues(m: MonitoringPointRow, properties: DisplayProperty[]) {
  const items: { label: React.ReactNode; children: string }[] = [];
  properties.forEach(({ fields = [], first, key, name, precision, unit }) => {
    if (fields.length > 1) {
      items.push(
        ...fields.map(({ key: subKey }) => {
          const axisKey = subKey.replace(`${key}_`, '');
          const axisName = Point.getAxisName(axisKey, m.attributes);
          const label = axisName ? `${intl.get(name)} ${intl.get(axisName)}` : intl.get(name);
          return {
            label: truncate(label, 24),
            children: `${getValue(roundValue(m?.data?.values[subKey] as number, precision))}${unit}`
          };
        })
      );
    } else {
      items.push({
        label: truncate(intl.get(name), 24),
        children: `${getValue(roundValue(m?.data?.values[key] as number, precision))}${unit}`
      });
    }
  });
  return items;
}
