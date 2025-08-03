import React from 'react';
import { Col, TabsProps } from 'antd';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../../utils/grid';
import { Card, Grid, Tabs, Table } from '../../../../components';
import { useLocaleContext } from '../../../../localeProvider';
import {
  StatisticBar,
  AssetRow,
  MONITORING_POINT_LIST,
  MonitoringPointRow,
  TabBarExtraLeftContent,
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
  const { id, alertLevel, monitoringPoints } = asset;
  const historyDatas = useHistoryDatas(asset);
  const items: TabsProps['items'] = [
    {
      label: intl.get('MONITOR'),
      key: 'monitor',
      children: (
        <EmptyMonitoringPoints asset={asset} key={asset.id}>
          <Grid>
            <Col span={24}>
              <Card>
                <StatisticBar asset={asset} />
              </Card>
            </Col>
            <Col span={24}>
              <Grid>
                <Col {...generateColProps({ xl: 12, xxl: 9 })}>
                  <PointsScatterChart asset={asset} title={intl.get('BOLT_DIAGRAM')} big={true} />
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
      children: (
        <MonitoringPointsTable
          key={asset.id}
          asset={asset}
          enableSettingColumnsCount={Points.filter(monitoringPoints).length > 0}
        />
      )
    },
    {
      label: intl.get('HISTORY_DATA'),
      key: 'history',
      children: (
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
      children: (
        <EmptyMonitoringPoints asset={asset} key={asset.id}>
          <PreloadCalculation.Status {...asset} />
        </EmptyMonitoringPoints>
      )
    });
  }
  items.push({
    label: intl.get('SETTINGS'),
    key: 'settings',
    children: (
      <Grid>
        <Col span={24}>
          <Update asset={asset} onSuccess={onSuccess} key={asset.id} />
        </Col>
        <Col span={24}>
          <Table
            cardProps={{
              extra: <ActionBar {...props} />,
              size: 'small',
              title: intl.get(MONITORING_POINT)
            }}
            columns={[
              ...getMonitoringPointColumns({
                language
              }),
              positionColumn,
              getOperateColumn({ onDeleteSuccess: props.onSuccess, onUpdate: props.onUpdate })
            ]}
            dataSource={Points.filter(monitoringPoints)}
            rowKey={(row) => row.id}
          />
        </Col>
      </Grid>
    )
  });

  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return (
    <Tabs
      items={items}
      noStyle={true}
      tabBarExtraContent={{
        left: (
          <TabBarExtraLeftContent alertLevel={alertLevel}>
            <AssetNavigator id={id} containerDomWidth={size?.width} type={asset.type} />
          </TabBarExtraLeftContent>
        )
      }}
      tabListRef={ref}
      tabsRighted={true}
    />
  );
};
