import React from 'react';
import { Device } from './device';
import { MonitoringPointsInfo } from './monitoring-ponit-info';
import { Report } from '../types';
import { transform } from '../utils';
import { MonitoringPointsStatus } from './monitoring-ponit-status';

export const Index = ({ report }: { report: Report }) => {
  const { devices, monitoringPoints } = transform(report);
  const devicesRestSize = Device.getRestSize(devices);
  const monitoringPointsInfoRestSize = MonitoringPointsInfo.getRestSize(
    monitoringPoints,
    devicesRestSize
  );
  const monitoringPointsStatusRestSize = MonitoringPointsStatus.getRestSize(
    monitoringPoints,
    monitoringPointsInfoRestSize
  );
  // console.log('devicesRestSize', devicesRestSize);
  // console.log('monitoringPointsInfoRestSize', monitoringPointsInfoRestSize);
  // console.log('monitoringPointsStatusRestSize', monitoringPointsStatusRestSize);
  // console.log('mmmmmmmmmmmmm', monitoringPoints)
  return (
    <>
      <Device.Pages list={devices} />
      <MonitoringPointsInfo.Pages
        list={monitoringPoints}
        header={<Device.Rest list={devices} />}
        headerSize={devicesRestSize}
      />
      <MonitoringPointsStatus.Pages
        list={monitoringPoints}
        header={
          <MonitoringPointsInfo.Rest
            list={monitoringPoints}
            header={<Device.Rest list={devices} />}
            headerSize={devicesRestSize}
          />
        }
        headerSize={monitoringPointsInfoRestSize}
      />
      {monitoringPointsStatusRestSize > 0 && (
        <section className='page last'>
          <MonitoringPointsStatus.Rest
            list={monitoringPoints}
            header={
              <MonitoringPointsInfo.Rest
                list={monitoringPoints}
                header={<Device.Rest list={devices} />}
                headerSize={devicesRestSize}
              />
            }
            headerSize={monitoringPointsInfoRestSize}
          />
        </section>
      )}
    </>
  );
};
