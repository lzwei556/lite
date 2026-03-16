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
  RelatedDeviceCard
} from '../../../asset-common';
import { Monitor } from './monitor';
import { History } from './history';
import { Settings } from './settings';
import { ThicknessWaveData, WaveformData } from './waveformData';
import { Permission, useCan } from '../../../providers/access-control';
import { CorrosionAnalysis } from 'features/monitoring-point-analysis-corrosion';

export const Index = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const canEditMeasurement = useCan(Permission.MeasurementEdit);
  const { id } = monitoringPoint;

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

  items.push({
    key: 'waveformData',
    label: Translation.get('feature.waveform'),
    content: (
      <DynamicData<ThicknessWaveData>
        children={(values) => <WaveformData {...{ values }} />}
        dataType='waveform'
        id={id}
        key={id}
      />
    )
  });

  items.push({
    key: 'analysis',
    label: Translation.get('button.intelligent-analysis'),
    content: <CorrosionAnalysis {...monitoringPoint} key={id} />
  });

  items.push({
    key: 'alerts',
    label: Translation.get('alarm.records'),
    content: (
      <FilterableAlarmRecordTable
        sourceId={id}
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
