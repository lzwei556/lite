import React from 'react';
import intl from 'react-intl-universal';
import { Permission, useCan } from 'providers/access-control';
import { Grid, TabsDetail, TabsDetailsItems } from 'components';
import { Overview } from './overview';
import {
  CustomizableIntervalMonitoringPointData,
  MonitoringPointWaveform
} from 'features/feature-data';
import { MonitoringPointProvider, useGetSeriesAlarm } from './provider';
import { VibrationAnalysis } from 'features/vibration-analysis';
import { CorrosionAnalysis } from 'features/corrosion-analysis';
import { FilterableAlarmRecordTable } from 'features/alarm';
import { Col } from 'antd';
import { generateColProps } from 'utils/grid';
import { UpdateFormCard, useUpdateFormProps } from 'features/monitoring-point-settings';
import { FillRecords, ProcessList } from 'features/process';
import { ProcessTypeKey } from 'process-type';
import { AssetNavigator } from 'features/asset-tree';
import { AlarmRuleSetting } from './alarm';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';
import { useAppConfig } from 'providers/app';
import { useAsset } from 'domain/asset';

export default function Index2({
  monitoringPoint,
  onSuccess
}: {
  monitoringPoint: TMonitoringPoint.Base;
  onSuccess: () => void;
}) {
  return (
    <MonitoringPointProvider id={monitoringPoint.id}>
      <TabsDetail
        items={useFeatures(monitoringPoint)}
        title={<AssetNavigator asset={monitoringPoint as any} />}
      />
    </MonitoringPointProvider>
  );
}

const useFeatures = (monitoringPoint: TMonitoringPoint.Base) => {
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
            {monitoringPoint.type === OMonitoringPoint.Type.OilFiller ? (
              <Grid>
                <Col span={24}>
                  <AlarmRuleSetting point={monitoringPoint as any} key={id} />
                </Col>
                <Col span={24}>
                  <ProcessList
                    {...{
                      monitoringPoint,
                      processList: monitoringPoint.actions ?? [],
                      monitoringPoints,
                      initialProcess: {
                        type: ProcessTypeKey.AutoFill,
                        oilFillerId: monitoringPoint.bindingDevices?.[0]?.id
                      },
                      onSuccess
                    }}
                  />
                </Col>
              </Grid>
            ) : (
              <AlarmRuleSetting point={monitoringPoint as any} key={id} />
            )}
          </Col>
        </Grid>
      )
    });
  }
  return items;
};

const useDynamicFeatures = (point: TMonitoringPoint.Base) => {
  const { assetId, attributes, id, type } = point;
  const asset = useAsset(assetId);
  const waveform = {
    key: 'waveformData',
    label: intl.get('WAVEFORM_DATA'),
    content: <MonitoringPointWaveform {...point} key={id} />
  };
  const vibrationEnabled = !!useAppConfig().analysisEnabled;
  if (OMonitoringPoint.Type.Category.getTypes(['corrosion']).includes(type)) {
    return [
      waveform,
      {
        key: 'analysis',
        label: intl.get('intelligent.analysis'),
        content: <CorrosionAnalysis {...(point as any)} key={id} />
      }
    ];
  } else if (OMonitoringPoint.Type.Category.getTypes(['vibration']).includes(type)) {
    if (type === OMonitoringPoint.Type.OilFiller) {
      return [
        {
          key: 'fillRecords',
          label: intl.get('fill.records'),
          content: <FillRecords {...point} key={id} />
        }
      ];
    } else if (vibrationEnabled) {
      return [
        {
          key: 'analysis',
          label: intl.get('intelligent.analysis'),
          content: <VibrationAnalysis {...{ asset, id, attributes }} key={id} />
        }
      ];
    } else {
      return [waveform];
    }
  } else if (OMonitoringPoint.Type.Category.getTypes(['inclination']).includes(type)) {
    return [{ ...waveform, key: 'dynamicData', label: intl.get('DYNAMIC_DATA') }];
  } else if (OMonitoringPoint.Type.Category.getTypes(['preload']).includes(type)) {
    return [waveform];
  } else {
    return [];
  }
};
