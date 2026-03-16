import React from 'react';
import { Col } from 'antd';
import { Translation } from 'locales/utils';
import { Grid, TabsDetail, Table, TabsDetailsItems, Card } from '../../../../components';
import {
  AssetRow,
  MONITORING_POINT_LIST,
  MonitoringPointRow,
  MonitoringPointsTable,
  Points,
  getMonitoringPointColumns,
  positionColumn,
  getOperateColumn,
  AssetNavigator,
  EmptyMonitoringPoints,
  StatisticBar
} from '../../../../asset-common';
import { useHistoryDatas } from '../../utils';
import { ActionBar } from '../../components/actionBar';
import * as Plain from '../plain';
import * as PreloadCalculation from '../preloadCalculation';
import { isFlangePreloadCalculation } from '../common';
import { History } from './history';
import { PointsScatterChart } from './pointsScatterChart';
import { Update } from './update';
import { Permission, useCan } from '../../../../providers/access-control';
import { generateColProps } from '../../../../utils/grid';
import { useI18n } from 'providers/i18n';

export const FlangeIndexLegacy = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (m: MonitoringPointRow) => void;
}) => {
  const { language } = useI18n();
  const { asset, onSuccess } = props;
  const { monitoringPoints } = asset;
  const { historyDatas } = useHistoryDatas(asset);
  const canAddMonitoringPoint = useCan(Permission.MeasurementAdd);
  const items: TabsDetailsItems = [
    {
      label: Translation.get('common.overview'),
      key: 'overview',
      content: (
        <EmptyMonitoringPoints asset={asset} key={asset.id}>
          <Grid>
            <Col span={24}>
              <StatisticBar asset={asset} />
            </Col>
            <Col span={24}>
              <Grid>
                <Col {...generateColProps({ xl: 12, xxl: 9 })}>
                  <Card title={Translation.get('asset.flange.bolt.diagram')}>
                    <PointsScatterChart asset={asset} big={true} />
                  </Card>
                </Col>
                <Col {...generateColProps({ xl: 12, xxl: 15 })}>
                  {isFlangePreloadCalculation(asset) ? (
                    <PreloadCalculation.RightConentInMonitorTab asset={asset} />
                  ) : (
                    <Plain.RightConentInMonitorTab asset={asset} historyDatas={historyDatas} />
                  )}
                </Col>
              </Grid>
            </Col>
          </Grid>
        </EmptyMonitoringPoints>
      )
    },
    {
      label: Translation.get(MONITORING_POINT_LIST),
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
          <History flange={asset} historyDatas={historyDatas} />
        </EmptyMonitoringPoints>
      )
    }
  ];
  if (isFlangePreloadCalculation(asset)) {
    items.push({
      label: Translation.get('asset.flange.status'),
      key: 'status',
      content: (
        <EmptyMonitoringPoints asset={asset} key={asset.id}>
          <PreloadCalculation.Status {...asset} />
        </EmptyMonitoringPoints>
      )
    });
  }
  items.push({
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
  });

  return <TabsDetail items={items} title={<AssetNavigator asset={asset} />} />;
};
