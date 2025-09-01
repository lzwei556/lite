import React from 'react';
import { Table } from '../../../components';

export const CorrosionFirst = () => {
  return (
    <>
      <section className='page'>
        <h3>一、 监测目的</h3>
        <p>实时监测设备状态，及时掌控腐蚀进程，预防腐蚀引发的设备失效事故。</p>
        <h3>二、 监测方法</h3>
        <p>超声波测厚。</p>
        <h3>三、 监测设备与系统</h3>
        <p>无线常温腐蚀传感器</p>
        <h3>四、 监测内容与数据</h3>
        <Table
          columns={[
            { key: 'name', dataIndex: 'name', title: '资产' },
            { key: 'count', dataIndex: 'count', title: '监测点（总数/报警）' }
          ]}
          dataSource={[
            { name: 'asset1', count: `4/0` },
            { name: 'asset2', count: `4/1` },
            { name: 'asset3', count: `4/0` },
            { name: 'asset4', count: `4/1` },
            { name: 'asset5', count: `4/0` },
            { name: 'asset6', count: `4/0` },
            { name: 'asset7', count: `4/0` },
            { name: 'asset8', count: `4/1` },
            { name: 'asset9', count: `4/2` },
            { name: 'asset10', count: `4/1` },
            { name: 'asset11', count: `4/0` }
          ]}
          noScroll={true}
          pagination={false}
        />
      </section>
      <section className='page'>
        <Table
          columns={[
            { key: 'name', dataIndex: 'name', title: '监测点' },
            { key: 'thickness', dataIndex: 'thickness', title: '厚度' }
          ]}
          dataSource={[
            { name: '点1', thickness: `4.625` },
            { name: '点2', thickness: `4.628` },
            { name: '点3', thickness: `4.630` },
            { name: '点4', thickness: `4.628` },
            { name: '点5', thickness: `4.631` },
            { name: '点6', thickness: `4.630` },
            { name: '点7', thickness: `4.628` },
            { name: '点8', thickness: `4.625` },
            { name: '点9', thickness: `4.620` },
            { name: '点10', thickness: `4.625` }
          ]}
          noScroll={true}
          pagination={false}
        />
      </section>
      <section className='page'>
        <h3>五、 监测结论</h3>
        <p>本次共监测资产24处，其中xxx腐蚀情况不佳，建议进行维护；其余资产腐蚀情况良好。</p>
      </section>
    </>
  );
};
