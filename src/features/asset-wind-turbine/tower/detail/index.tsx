import React from 'react';
import { Col } from 'antd';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { Grid, Table, Tabs } from '../../../../components';
import { useLocaleContext } from '../../../../localeProvider';
import {
  AssetRow,
  getMonitoringPointColumns,
  getOperateColumn,
  MONITORING_POINT,
  MONITORING_POINT_LIST,
  MonitoringPointRow,
  MonitoringPointsTable,
  Points,
  positionColumn,
  installAngle,
  TabBarExtraLeftContent,
  installHeight,
  installRadius,
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
  const { id, alertLevel, monitoringPoints } = asset;
  const historyDatas = useHistoryDatas(asset);
  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return (
    <Tabs
      items={[
        {
          label: intl.get(MONITORING_POINT_LIST),
          key: 'monitoringPointList',
          children: (
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
          children: (
            <EmptyMonitoringPoints asset={asset} key={asset.id}>
              <History asset={asset} historyDatas={historyDatas} />
            </EmptyMonitoringPoints>
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
                    installAngle,
                    installHeight,
                    installRadius,
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
