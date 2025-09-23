import React from 'react';
import { Button, Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { Card, Flex, Grid, TabsDetail } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import {
  AlarmsObjectStatistics,
  AssetNavigator,
  AssetRow,
  SensorsStatistics
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
  const { statistics } = asset;
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
    <TabsDetail
      items={[
        {
          label: intl.get('assets'),
          key: 'asset',
          content: (
            <Grid wrap={false}>
              <Col flex='auto'>
                {renderAssetList(
                  asset.children
                    ?.sort((prev, next) => {
                      const { index: prevIndex } = prev.attributes || { index: 88 };
                      const { index: nextIndex } = next.attributes || { index: 88 };
                      return prevIndex - nextIndex;
                    })
                    ?.map((a) => (
                      <Col key={a.id} {...generateColProps({ xl: 12, xxl: 12 })}>
                        <OverviewCard asset={a} />
                      </Col>
                    ))
                )}
              </Col>
              <Col flex='300px'>
                <Grid>
                  <Col span={24}>
                    <AlarmsObjectStatistics
                      total={statistics.monitoringPointNum}
                      alarms={statistics.alarmNum}
                      title={intl.get('monitoring.points')}
                      subtext={intl.get('total')}
                    />
                  </Col>
                  <Col span={24}>
                    <SensorsStatistics
                      total={statistics.deviceNum}
                      offlines={statistics.offlineDeviceNum}
                    />
                  </Col>
                </Grid>
              </Col>
            </Grid>
          )
        },
        {
          label: intl.get('SETTINGS'),
          key: 'settings',
          content: (
            <Grid>
              <Col span={24}>
                <Update asset={asset} onSuccess={onSuccess} key={asset.id} />
              </Col>
              <Col span={24}>
                <Flex>
                  <Button.Group>
                    <ActionBar {...props} />
                  </Button.Group>
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
      title={<AssetNavigator asset={asset} />}
    />
  );
};
