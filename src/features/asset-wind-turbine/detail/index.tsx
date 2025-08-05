import React from 'react';
import { Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { Card, Flex, Grid, Tabs } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import {
  AssetNavigator,
  AssetRow,
  StatisticBar,
  TabBarExtraLeftContent
} from '../../../asset-common';
import { ActionBar } from '../components/actionBar';
import { Update } from './update';
import { OverviewCard } from './overviewCard';
import { ChildrenAttrsTable } from './childrenAttrsTable';

export const Index = (props: {
  asset: AssetRow;
  onUpdateAsset: (a: AssetRow) => void;
  onSuccess: () => void;
}) => {
  const { asset, onUpdateAsset, onSuccess } = props;
  const { id, alertLevel } = asset;
  const renderAssetList = (content: React.ReactNode) => {
    return (asset.children?.length ?? 0) > 0 ? (
      <Grid>{content}</Grid>
    ) : (
      <Card title={intl.get('assets')}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  };

  return (
    <Tabs
      items={[
        {
          label: intl.get('assets'),
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
                  asset.children
                    ?.sort((prev, next) => {
                      const { index: prevIndex } = prev.attributes || { index: 88 };
                      const { index: nextIndex } = next.attributes || { index: 88 };
                      return prevIndex - nextIndex;
                    })
                    ?.map((a) => (
                      <Col key={a.id} {...generateColProps({ xl: 12, xxl: 8 })}>
                        <OverviewCard asset={a} />
                      </Col>
                    ))
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
                <Flex>
                  <ActionBar {...props} />
                </Flex>
              </Col>
              <Col span={24}>
                {renderAssetList(
                  <ChildrenAttrsTable
                    assets={asset.children ?? []}
                    operateCellProps={{ onSuccess, onUpdate: onUpdateAsset }}
                  />
                )}
              </Col>
            </Grid>
          )
        }
      ]}
      noStyle={true}
      tabBarExtraContent={{
        left: (
          <TabBarExtraLeftContent alertLevel={alertLevel}>
            <AssetNavigator id={id} type={asset.type} />
          </TabBarExtraLeftContent>
        )
      }}
      tabsRighted={true}
    />
  );
};
