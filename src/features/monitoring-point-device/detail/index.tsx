import React from 'react';
import { Col, TabsProps } from 'antd';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { Grid, MetaCard, Tabs } from '../../../components';
import { FilterableAlarmRecordTable } from '../../alarm';
import usePermission, { Permission } from '../../../permission/permission';
import {
  AssetNavigator,
  BasicCard,
  MonitoringPointRow,
  RelatedDeviceCard,
  TabBarExtraLeftContent
} from '../../../asset-common';
import { Monitor } from './monitor';
import { History } from './history';
import { Settings } from './settings';

export const Index = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const { hasPermission } = usePermission();
  const { alertLevel, id, type } = monitoringPoint;

  const items: TabsProps['items'] = [
    {
      key: 'overview',
      label: intl.get('OVERVIEW'),
      children: (
        <div style={{ marginTop: 16 }}>
          <Grid wrap={false}>
            <Col flex='auto'>
              <MetaCard
                title={intl.get('real.time.data')}
                description={<Monitor {...monitoringPoint} key={id} />}
              />
            </Col>
            <Col flex='300px'>
              <Grid>
                <Col span={24}>
                  <BasicCard monitoringPoint={monitoringPoint} />
                </Col>
                <Col span={24}>
                  <RelatedDeviceCard {...monitoringPoint} />
                </Col>
              </Grid>
            </Col>
          </Grid>
        </div>
      )
    },
    {
      key: 'history',
      label: intl.get('HISTORY_DATA'),
      children: <History {...monitoringPoint} key={id} />
    }
  ];

  items.push({
    key: 'alerts',
    label: intl.get('ALARM_RECORDS'),
    children: (
      <FilterableAlarmRecordTable
        sourceId={id}
        storeKey='monitoringPointAlarmRecordList'
        key={id}
      />
    )
  });
  if (hasPermission(Permission.MeasurementEdit)) {
    items.push({
      key: 'settings',
      label: intl.get('SETTINGS'),
      children: <Settings point={monitoringPoint} onSuccess={onSuccess} key={id} />
    });
  }

  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return (
    <Tabs
      items={items}
      noStyle={true}
      tabBarExtraContent={{
        left: (
          <TabBarExtraLeftContent alertLevel={alertLevel}>
            <AssetNavigator id={id} containerDomWidth={size?.width} type={type} />
          </TabBarExtraLeftContent>
        )
      }}
      tabListRef={ref}
      tabsRighted={true}
    />
  );
};
