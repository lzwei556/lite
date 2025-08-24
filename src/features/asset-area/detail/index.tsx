import React from 'react';
import { Col, Empty } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../utils/grid';
import { Card, Grid, TabsDetail } from '../../../components';
import {
  AlarmsObjectStatistics,
  AssetNavigator,
  AssetRow,
  SensorsStatistics
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
  const { statistics } = asset;
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
          label: intl.get('assets'),
          key: 'asset',
          content: (
            <Grid wrap={false} align='stretch'>
              <Col flex='auto'>
                <Card style={{ height: '100%' }}>
                  {renderAssetList(
                    <Grid>
                      {asset.children?.map((a) => (
                        <Col key={a.id} {...generateColProps({ lg: 12, xl: 12, xxl: 8 })}>
                          <OverviewCard asset={a} />
                        </Col>
                      ))}
                    </Grid>
                  )}
                </Card>
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
