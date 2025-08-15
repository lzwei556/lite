import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Grid, Table, TabsDetail } from '../../../../components';
import { useLocaleContext } from '../../../../localeProvider';
import {
  AssetRow,
  getMonitoringPointColumns,
  getOperateColumn,
  MonitoringPointRow,
  MonitoringPointsTable,
  Points,
  positionColumn,
  getInstallAngleColumn,
  getInstallHeightColumn,
  getBaseRadiusColumn,
  AssetNavigator,
  EmptyMonitoringPoints
} from '../../../../asset-common';
import { ActionBar } from '../../components/actionBar';
import { useHistoryDatas } from '../../utils';
import { History } from './history';
import { Update } from './update';

export const Index = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (m: MonitoringPointRow) => void;
}) => {
  const { language } = useLocaleContext();
  const { asset, onSuccess } = props;
  const { monitoringPoints } = asset;
  const historyDatas = useHistoryDatas(asset);

  return (
    <TabsDetail
      items={[
        {
          label: intl.get('monitoring.points'),
          key: 'monitoringPointList',
          content: (
            <MonitoringPointsTable
              key={`${asset.monitoringPoints?.map(({ id }) => id).join()}`}
              asset={asset}
              enableSettingColumnsCount={Points.filter(monitoringPoints).length > 0}
            />
          )
        },
        {
          label: intl.get('HISTORY_DATA'),
          key: 'history',
          content: (
            <EmptyMonitoringPoints asset={asset} key={asset.id}>
              <History asset={asset} historyDatas={historyDatas} />
            </EmptyMonitoringPoints>
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
                <Table
                  cardProps={{
                    extra: <ActionBar {...props} />,
                    title: intl.get('monitoring.points')
                  }}
                  columns={[
                    ...getMonitoringPointColumns({
                      language
                    }),
                    positionColumn,
                    getInstallAngleColumn(language),
                    getInstallHeightColumn(language),
                    getBaseRadiusColumn(language),
                    getOperateColumn({
                      onDeleteSuccess: () => props.onSuccess(),
                      onUpdate: props.onUpdate
                    })
                  ]}
                  dataSource={Points.filter(monitoringPoints)}
                  rowKey={(row) => row.id}
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
