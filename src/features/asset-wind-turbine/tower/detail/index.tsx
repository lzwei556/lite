import React from 'react';
import { Col } from 'antd';
import { Translation } from 'locales/utils';
import { Grid, Table, TabsDetail } from '../../../../components';
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
import { Permission, useCan } from '../../../../providers/access-control';
import { useI18n } from 'providers/i18n';

export const Index = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (m: MonitoringPointRow) => void;
}) => {
  const { language } = useI18n();
  const { asset, onSuccess } = props;
  const { monitoringPoints } = asset;
  const { historyDatas } = useHistoryDatas(asset);
  const canAddMonitoringPoint = useCan(Permission.MeasurementAdd);

  return (
    <TabsDetail
      items={[
        {
          label: Translation.get('monitoring.points'),
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
          label: Translation.get('feature.history'),
          key: 'history',
          content: (
            <EmptyMonitoringPoints asset={asset} key={asset.id}>
              <History asset={asset} historyDatas={historyDatas} />
            </EmptyMonitoringPoints>
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
                <Table
                  cardProps={{
                    extra: canAddMonitoringPoint && <ActionBar {...props} />,
                    title: Translation.get('monitoring.points')
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
