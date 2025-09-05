import React from 'react';
import { Device } from './device';
import { MonitoringPointsInfo } from './monitoring-ponit';

export const Index = () => {
  const devices = Array(0).fill({
    mac: '00-1A-79-4A-3B-21',
    type: 'DC210',
    battery: 3580,
    qiangdu: 0.4,
    zhiliang: 50,
    status: '信号质量差'
  });

  const points_info = Array(13).fill({
    index: 1,
    asset: '原料输送管道A线',
    name: '监测点名称',
    initial: 5.4,
    cri: 6.2,
    condition: '腐蚀率 > 1.0 减薄量 > 0.5'
  });
  console.log('Device.getRestSize(devices)', Device.getRestSize(devices));

  return (
    <>
      <Device.Pages list={devices} />
      <MonitoringPointsInfo.Pages
        list={points_info}
        header={<Device.Rest list={devices} />}
        headerSize={Device.getRestSize(devices)}
      />
      <section className='page'>
        <MonitoringPointsInfo.Rest
          list={points_info}
          header={<Device.Rest list={devices} />}
          headerSize={Device.getRestSize(devices)}
        />
      </section>
    </>
  );
};
