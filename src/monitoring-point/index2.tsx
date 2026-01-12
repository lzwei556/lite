import React from 'react';
import intl from 'react-intl-universal';
import { MonitoringPoint, MonitoringPointType } from 'common';
import { Permission, useCan } from 'providers/access-control';
import { Grid, TabsDetail, TabsDetailsItems } from 'components';
import { Overview } from './overview';
import {
  CustomizableIntervalMonitoringPointData,
  MonitoringPointWaveform
} from 'features/feature-data';
import { MonitoringPointProvider, useGetSeriesAlarm } from './provider';
import { AlarmRuleSetting, AssetNavigator } from 'asset-common';
import { useAppVibrationEnabled } from 'config';
import { VibrationAnalysis } from 'features/vibration-analysis';
import { CorrosionAnalysis } from 'features/corrosion-analysis';
import { FilterableAlarmRecordTable } from 'features/alarm';
import { Col } from 'antd';
import { generateColProps } from 'utils/grid';
import { UpdateFormCard, useUpdateFormProps } from 'features/monitoring-point-settings';

export const Index2 = ({
  monitoringPoint,
  onSuccess
}: {
  monitoringPoint: MonitoringPoint;
  onSuccess: () => void;
}) => {
  return (
    <MonitoringPointProvider id={monitoringPoint.id}>
      <TabsDetail
        items={useFeatures(monitoringPoint)}
        title={<AssetNavigator asset={monitoringPoint as any} />}
      />
    </MonitoringPointProvider>
  );
};

const useFeatures = (monitoringPoint: MonitoringPoint) => {
  const canEditMeasurement = useCan(Permission.MeasurementEdit);
  const { id } = monitoringPoint;
  const items: TabsDetailsItems = [
    {
      key: 'overview',
      label: intl.get('OVERVIEW'),
      content: <Overview {...{ monitoringPoint }} key={id} />
    },
    {
      key: 'history',
      label: intl.get('HISTORY_DATA'),
      content: (
        <CustomizableIntervalMonitoringPointData
          {...{ ...monitoringPoint, ...useGetSeriesAlarm() }}
          key={id}
        />
      )
    }
  ];
  useDynamicFeatures(monitoringPoint).forEach((item) => items.push(item));
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

  const updateFormProps = useUpdateFormProps(monitoringPoint);

  if (canEditMeasurement) {
    items.push({
      key: 'settings',
      label: intl.get('SETTINGS'),
      content: (
        <Grid>
          <Col {...generateColProps({ xl: 8, xxl: 8 })}>
            <UpdateFormCard {...updateFormProps} key={id} />
          </Col>
          <Col {...generateColProps({ xl: 16, xxl: 16 })}>
            <AlarmRuleSetting point={monitoringPoint as any} key={id} />
          </Col>
        </Grid>
      )
    });
  }
  return items;
};

const useDynamicFeatures = (point: MonitoringPoint) => {
  const { assetId, attributes, id, type } = point;
  const waveform = {
    key: 'waveformData',
    label: intl.get('WAVEFORM_DATA'),
    content: <MonitoringPointWaveform {...point} key={id} />
  };
  const vibrationEnabled = useAppVibrationEnabled();
  if (MonitoringPointType.Categories.getKeys(['corrosion']).includes(type)) {
    return [
      waveform,
      {
        key: 'analysis',
        label: intl.get('intelligent.analysis'),
        content: <CorrosionAnalysis {...(point as any)} key={id} />
      }
    ];
  } else if (MonitoringPointType.Categories.getKeys(['vibration']).includes(type)) {
    return vibrationEnabled
      ? [
          {
            key: 'analysis',
            label: intl.get('intelligent.analysis'),
            content: <VibrationAnalysis {...{ assetId, id, attributes }} key={id} />
          }
        ]
      : [waveform];
  } else if (MonitoringPointType.Categories.getKeys(['inclination']).includes(type)) {
    return [{ ...waveform, key: 'dynamicData', label: intl.get('DYNAMIC_DATA') }];
  } else if (MonitoringPointType.Categories.getKeys(['preload']).includes(type)) {
    return [waveform];
  } else {
    return [];
  }
};
