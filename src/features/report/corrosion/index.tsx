import React from 'react';
import { Device } from './device';
import { MonitoringPointsInfo } from './monitoring-ponit-info';
import { Report } from '../types';
import { transform } from '../utils';
import { MonitoringPointsStatus } from './monitoring-ponit-status';
import { DeviceEvalLevel, MonitoringPointEvalLevel } from '../constants';
import { Conclusion } from '../conclusion';
import { AlarmRecord } from './unprocessed-alarm-records';

export const Index = ({ report }: { report: Report }) => {
  const { devices, monitoringPoints, alarmRecords } = transform(report);
  const devicesList = devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error);
  const devicesStatistics = [
    devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Normal).length,
    devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error).length
  ];
  const devicesRestSize = Device.getRestSize(devicesList);
  const monitoringPointsInfoRestSize = MonitoringPointsInfo.getRestSize(
    monitoringPoints,
    devicesRestSize
  );
  const monitoringStatusStatistics = [
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Normal).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Minor).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Major).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Critical).length
  ];
  const monitoringPointsStatusRestSize = MonitoringPointsStatus.getRestSize(
    monitoringPoints,
    monitoringPointsInfoRestSize
  );
  const alarmRecordsList = (alarmRecords ?? []).filter((r: any) => r.status === 0);
  const alarmRecordsRestSize = AlarmRecord.getRestSize(
    alarmRecordsList,
    monitoringPointsStatusRestSize
  );
  const deviceRest = <Device.Rest list={devicesList} statistics={devicesStatistics} />;
  const monitoringPointInfoRest = (
    <MonitoringPointsInfo.Rest
      list={monitoringPoints}
      header={deviceRest}
      headerSize={devicesRestSize}
    />
  );
  const monitoringPointStatusRest = (
    <MonitoringPointsStatus.Rest
      list={monitoringPoints}
      header={monitoringPointInfoRest}
      headerSize={monitoringPointsInfoRestSize}
      statistics={monitoringStatusStatistics}
    />
  );
  const alarmRecordsRest = (
    <AlarmRecord.Rest
      list={alarmRecordsList}
      header={monitoringPointStatusRest}
      headerSize={monitoringPointsStatusRestSize}
    />
  );

  return (
    <>
      <Device.Pages list={devicesList} statistics={devicesStatistics} />
      <MonitoringPointsInfo.Pages
        list={monitoringPoints}
        header={deviceRest}
        headerSize={devicesRestSize}
      />
      <MonitoringPointsStatus.Pages
        list={monitoringPoints}
        header={monitoringPointInfoRest}
        headerSize={monitoringPointsInfoRestSize}
        statistics={monitoringStatusStatistics}
      />
      <AlarmRecord.Pages
        list={alarmRecords}
        header={monitoringPointStatusRest}
        headerSize={monitoringPointsStatusRestSize}
      />
      <Conclusion
        report={transform(report)}
        header={alarmRecordsRest}
        headerSize={alarmRecordsRestSize}
      />
    </>
  );
};
