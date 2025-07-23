import React from 'react';
import { Col, Radio, TabsProps } from 'antd';
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
  MONITORING_POINT,
  getMonitoringPointColumns,
  positionColumn,
  getOperateColumn,
  AssetNavigator,
  EmptyMonitoringPoints
} from '../../../asset-common';
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
  const [type, setType] = React.useState('basic');
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
      <Card>
        <Radio.Group
          options={[
            { label: intl.get('BASIC_INFORMATION'), value: 'basic' },
            { label: intl.get(MONITORING_POINT), value: 'monitoringPoints' }
          ]}
          onChange={(e) => setType(e.target.value)}
          value={type}
          optionType='button'
          buttonStyle='solid'
        />
        {type === 'basic' && <Update asset={asset} onSuccess={onSuccess} key={asset.id} />}
        {type === 'monitoringPoints' && (
          <Table
            columns={[
              ...getMonitoringPointColumns({
                language
              }),
              positionColumn,
              getOperateColumn({ onDeleteSuccess: props.onSuccess, onUpdate: props.onUpdate })
            ]}
            dataSource={Points.filter(monitoringPoints)}
            header={{ toolbar: [<ActionBar {...props} />] }}
            rowKey={(row) => row.id}
          />
        )}
      </Card>
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
