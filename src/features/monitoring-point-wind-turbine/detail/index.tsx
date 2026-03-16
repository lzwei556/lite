import React from 'react';
import { Col } from 'antd';
import { Translation } from 'locales/utils';
import { Grid, MutedCard, TabsDetail, TabsDetailsItems } from '../../../components';
import { FilterableAlarmRecordTable } from '../../alarm';
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
import { Permission, useCan } from '../../../providers/access-control';
import { MonitoringPointType } from 'common';

export const Index = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const canEditMeasurement = useCan(Permission.MeasurementEdit);
  const { id, type } = monitoringPoint;
  const items: TabsDetailsItems = [
    {
      key: 'overview',
      label: Translation.get('common.overview'),
      content: (
        <Grid wrap={false}>
          <Col flex='auto'>
            <MutedCard title={Translation.get('feature.real-time')}>
              <Monitor {...monitoringPoint} key={id} />
            </MutedCard>
          </Col>
          <Col flex='300px'>
            <Grid>
              <Col span={24}>
                <BasicCard monitoringPoint={monitoringPoint} />
              </Col>
              <Col span={24}>
                <RelatedDeviceCard monitoringPoint={monitoringPoint} />
              </Col>
            </Grid>
          </Col>
        </Grid>
      )
    },
    {
      key: 'history',
      label: Translation.get('feature.history'),
      content: <History {...monitoringPoint} key={id} />
    }
  ];
  if (type === MonitoringPointType.Value.InclinationTop) {
    items.push({
      key: 'dynamicData',
      label: Translation.get('feature.dynamic'),
      content: (
        <DynamicData<AngleDynamicData>
          children={(values) => <Angle {...{ values, monitoringPoint }} />}
          dataType='raw'
          id={id}
          key={id}
        />
      )
    });
  } else if (type === MonitoringPointType.Value.InclinationBase) {
    items.push({
      key: 'dynamicData',
      label: Translation.get('feature.dynamic'),
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
      label: Translation.get('feature.waveform'),
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
    label: Translation.get('alarm.records'),
    content: (
      <FilterableAlarmRecordTable
        sourceId={monitoringPoint.id}
        storeKey='monitoringPointAlarmRecordList'
        key={id}
      />
    )
  });
  if (canEditMeasurement) {
    items.push({
      key: 'settings',
      label: Translation.get('common.settings'),
      content: <Settings point={monitoringPoint} onSuccess={onSuccess} key={id} />
    });
  }

  return (
    <MonitoringPointProvider id={id}>
      <TabsDetail items={items} title={<AssetNavigator asset={monitoringPoint} />} />
    </MonitoringPointProvider>
  );
};
