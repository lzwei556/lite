import React from 'react';
import { Radio } from 'antd';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { Card, Table, Tabs } from '../../../../components';
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
} from '../../../asset-common';
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
  const [type, setType] = React.useState('basic');
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
              <History asset={asset} historyDatas={historyDatas} />
            </EmptyMonitoringPoints>
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
                    installAngle,
                    installHeight,
                    installRadius,
                    getOperateColumn({
                      onDeleteSuccess: props.onSuccess,
                      onUpdate: props.onUpdate
                    })
                  ]}
                  dataSource={Points.filter(monitoringPoints)}
                  header={{ toolbar: [<ActionBar {...props} />] }}
                  rowKey={(row) => row.id}
                />
              )}
            </Card>
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
