import React from 'react';
import { Col, Empty } from 'antd';
import { Translation } from 'locales/utils';
import { generateColProps } from '../../../utils/grid';
import { Card, Grid, TabsDetail } from '../../../components';
import { AssetNavigator, AssetRow, StatisticBar } from '../../../asset-common';
import { Update } from './update';
import { Settings } from './settings';
import { OverviewCardLegacy } from './overviewCard-legacy';

export const IndexLegacy = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdateAsset: (asset: AssetRow) => void;
}) => {
  const { asset, onSuccess, onUpdateAsset } = props;
  const renderAssetList = (content: React.ReactNode) => {
    return (asset.children?.length ?? 0) > 0 ? (
      content
    ) : (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  };

  return (
    <TabsDetail
      items={[
        {
          label: Translation.get('assets'),
          key: 'asset',
          content: (
            <Grid>
              <Col span={24}>
                <StatisticBar asset={asset} />
              </Col>
              <Col span={24}>
                {renderAssetList(
                  <Grid>
                    {asset.children?.map((a) => (
                      <Col key={a.id} {...generateColProps({ lg: 12, xl: 12, xxl: 8 })}>
                        <OverviewCardLegacy asset={a} />
                      </Col>
                    ))}
                  </Grid>
                )}
              </Col>
            </Grid>
          )
        },
        {
          label: Translation.get('common.settings'),
          key: 'settings',
          content: (
            <Grid>
              <Col span={24}>
                <Update asset={asset} onSuccess={onSuccess} key={asset.id} />
              </Col>
              <Col span={24}>
                <Settings
                  asset={asset}
                  onSuccess={onSuccess}
                  key={asset.id}
                  onUpdate={onUpdateAsset}
                />
              </Col>
            </Grid>
          )
        }
      ]}
      title={<AssetNavigator asset={asset} />}
    />
  );
};
