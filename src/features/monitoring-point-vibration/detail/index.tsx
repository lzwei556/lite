import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Grid, MutedCard, TabsDetail, TabsDetailsItems } from '../../../components';
import { FilterableAlarmRecordTable } from '../../alarm';
import usePermission, { Permission } from '../../../permission/permission';
import { useAppVibrationEnabled } from '../../../config';
import {
  AssetNavigator,
  MonitoringPointRow,
  RelatedDeviceCard,
  BasicCard,
  MonitoringPointProvider
} from '../../../asset-common';
import { Index as Analysis } from '../analysis';
import { Monitor } from './monitor';
import { History } from './history';
import { Settings } from './settings';
import { WaveformData } from './waveformData';

export const Index = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const { hasPermission } = usePermission();
  const vibrationEnabled = useAppVibrationEnabled();
  const { id, attributes, assetId } = monitoringPoint;

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

  if (vibrationEnabled) {
    items.push({
      key: 'analysis',
      label: intl.get('intelligent.analysis'),
      content: <Analysis id={id} key={id} attributes={attributes} assetId={assetId} />
    });
  } else {
    items.push({
      key: 'waveformData',
      label: intl.get('WAVEFORM_DATA'),
      content: <WaveformData id={id} key={id} />
    });
  }

  items.push({
    key: 'alerts',
    label: intl.get('ALARM_RECORDS'),
    content: (
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
      content: <Settings monitoringPoint={monitoringPoint} onSuccess={onSuccess} key={id} />
    });
  }

  return (
    <MonitoringPointProvider id={id}>
      <TabsDetail items={items} title={<AssetNavigator asset={monitoringPoint} />} />
    </MonitoringPointProvider>
  );
};
