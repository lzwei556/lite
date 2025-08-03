import React from 'react';
import { Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../utils/grid';
import { Card, Grid, Tabs } from '../../../components';
import {
  AssetNavigator,
  AssetRow,
  StatisticBar,
  TabBarExtraLeftContent
} from '../../../asset-common';
import { Update } from './update';
import { OverviewCard } from './overviewCard';
import { Settings } from './settings';

export const Index = (props: {
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
    <Tabs
      items={[
        {
          label: intl.get('ASSET'),
          key: 'asset',
          children: (
            <Grid>
              <Col span={24}>
                <Card>
                  <StatisticBar asset={asset} />
                </Card>
              </Col>
              <Col span={24}>
                {renderAssetList(
                  <Grid>
                    {asset.children?.map((a) => (
                      <Col key={a.id} {...generateColProps({ md: 12, lg: 12, xl: 12, xxl: 8 })}>
                        <OverviewCard asset={a} />
                      </Col>
                    ))}
                  </Grid>
                )}
              </Col>
            </Grid>
          )
        },
        {
          label: intl.get('SETTINGS'),
          key: 'settings',
          children: (
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
      noStyle={true}
      tabBarExtraContent={{
        left: (
          <TabBarExtraLeftContent alertLevel={asset.alertLevel}>
            <AssetNavigator id={asset.id} type={asset.type} />
          </TabBarExtraLeftContent>
        )
      }}
      tabsRighted={true}
    />
  );
};
