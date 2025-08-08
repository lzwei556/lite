import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../../utils/grid';
import { Grid, TabsDetail, Table, TabsDetailsItems, Card } from '../../../../components';
import { useLocaleContext } from '../../../../localeProvider';
import {
  StatisticBar,
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
  MONITORING_POINT
} from '../../../../asset-common';
import { useHistoryDatas } from '../../utils';
import { ActionBar } from '../../components/actionBar';
import * as Plain from '../plain';
import * as PreloadCalculation from '../preloadCalculation';
import { isFlangePreloadCalculation } from '../common';
import { History } from './history';
import { PointsScatterChart } from './pointsScatterChart';
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
  const items: TabsDetailsItems = [
    {
      label: intl.get('OVERVIEW'),
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
                  <Card title={intl.get('BOLT_DIAGRAM')}>
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
      label: intl.get(MONITORING_POINT_LIST),
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
          <History flange={asset} historyDatas={historyDatas} />
        </EmptyMonitoringPoints>
      )
    }
  ];
  if (isFlangePreloadCalculation(asset)) {
    items.push({
      label: intl.get('FLANGE_STATUS'),
      key: 'status',
      content: (
        <EmptyMonitoringPoints asset={asset} key={asset.id}>
          <PreloadCalculation.Status {...asset} />
        </EmptyMonitoringPoints>
      )
    });
  }
  items.push({
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
              title: intl.get(MONITORING_POINT)
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
