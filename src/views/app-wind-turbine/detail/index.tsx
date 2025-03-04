import React from 'react';
import { Col, Empty, Radio } from 'antd';
import intl from 'react-intl-universal';
import { Card, Flex, Grid, Tabs } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import { AssetNavigator, AssetRow, StatisticBar, TabBarExtraLeftContent } from '../../asset-common';
import { Update } from './update';
import { OverviewCard } from './overviewCard';
import { ActionBar } from '../components/actionBar';
import { ChildrenAttrsTable } from './childrenAttrsTable';

export const Index = (props: {
  asset: AssetRow;
  onUpdateAsset: (a: AssetRow) => void;
  onSuccess: () => void;
}) => {
  const { asset, onUpdateAsset, onSuccess } = props;
  const { id, alertLevel } = asset;
  const [type, setType] = React.useState('basic');
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
          children: renderAssetList(
            <Grid>
              <Col span={24}>
                <Card>
                  <StatisticBar asset={asset} />
                </Card>
              </Col>
              {asset.children
                ?.sort((prev, next) => {
                  const { index: prevIndex } = prev.attributes || { index: 88 };
                  const { index: nextIndex } = next.attributes || { index: 88 };
                  return prevIndex - nextIndex;
                })
                ?.map((a) => (
                  <Col key={a.id} {...generateColProps({ md: 12, lg: 12, xl: 12, xxl: 8 })}>
                    <OverviewCard asset={a} />
                  </Col>
                ))}
            </Grid>
          )
        },
        {
          label: intl.get('SETTINGS'),
          key: 'settings',
          children: (
            <Card>
              <Radio.Group
                options={[
                  { label: intl.get('BASIC_INFORMATION'), value: 'basic' },
                  { label: intl.get('ASSET'), value: 'asset' }
                ]}
                onChange={(e) => setType(e.target.value)}
                value={type}
                optionType='button'
                buttonStyle='solid'
              />
              {type === 'basic' && <Update asset={asset} onSuccess={onSuccess} key={asset.id} />}
              {type === 'asset' && (
                <Grid>
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
              )}
            </Card>
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
