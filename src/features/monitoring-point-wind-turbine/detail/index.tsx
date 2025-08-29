import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Grid, MutedCard, TabsDetail, TabsDetailsItems } from '../../../components';
import { FilterableAlarmRecordTable } from '../../alarm';
import usePermission, { Permission } from '../../../permission/permission';
import { MonitoringPointTypeValue } from '../../../config';
import {
  AssetNavigator,
  BasicCard,
  DynamicData,
  MonitoringPointProvider,
  MonitoringPointRow,
  Point,
  RelatedDeviceCard
} from '../../../asset-common';
import { Monitor } from './monitor';
import { History } from './history';
import { Angle } from './dynamic/angle';
import { AngleBase } from './dynamic/angleBase';
import { PreloadWaveform } from './preloadWaveform';
import { Settings } from './settings';
import { AngleDynamicData, PreloadWaveData } from './dynamic/types';

export const Index = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const { hasPermission } = usePermission();
  const { id, type } = monitoringPoint;
  const items: TabsDetailsItems = [
    {
      key: 'overview',
      label: intl.get('OVERVIEW'),
      content: (
        <Grid wrap={false}>
          <Col flex='auto'>
            <MutedCard title={intl.get('real.time.data')}>
              <Monitor {...monitoringPoint} key={id} />
            </MutedCard>
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
      )
    },
    {
      key: 'history',
      label: intl.get('HISTORY_DATA'),
      content: <History {...monitoringPoint} key={id} />
    }
  ];
  if (type === MonitoringPointTypeValue.TopInclination) {
    items.push({
      key: 'dynamicData',
      label: intl.get('DYNAMIC_DATA'),
      content: (
        <DynamicData<AngleDynamicData>
          children={(values) => <Angle {...{ values, monitoringPoint }} />}
          dataType='raw'
          id={id}
          key={id}
        />
      )
    });
  } else if (type === MonitoringPointTypeValue.BaseInclination) {
    items.push({
      key: 'dynamicData',
      label: intl.get('DYNAMIC_DATA'),
      content: (
        <DynamicData<AngleDynamicData>
          children={(values) => <AngleBase {...{ values, monitoringPoint }} />}
          dataType='raw'
          id={id}
          key={id}
        />
      )
    });
  }
  if (Point.Assert.isPreload(type)) {
    items.push({
      key: 'waveformData',
      label: intl.get('WAVEFORM_DATA'),
      content: (
        <DynamicData<PreloadWaveData>
          children={(values) => <PreloadWaveform {...{ values }} />}
          dataType='waveform'
          id={id}
          key={id}
        />
      )
    });
  }
  items.push({
    key: 'alerts',
    label: intl.get('ALARM_RECORDS'),
    content: (
      <FilterableAlarmRecordTable
        sourceId={monitoringPoint.id}
        storeKey='monitoringPointAlarmRecordList'
        key={id}
      />
    )
  });
  if (hasPermission(Permission.MeasurementEdit)) {
    items.push({
      key: 'settings',
      label: intl.get('SETTINGS'),
      content: <Settings point={monitoringPoint} onSuccess={onSuccess} key={id} />
    });
  }

  return (
    <MonitoringPointProvider id={id}>
      <TabsDetail items={items} title={<AssetNavigator asset={monitoringPoint} />} />
    </MonitoringPointProvider>
  );
};
